import mysql, {Pool} from 'mysql';

type NumberOfChallenges = {
    [difficulty: number]: {
        difficulty: string,
        challenges: number
    }
}

class ChallengeManager {
    private static instance;

    public static getInstance(): ChallengeManager {
        if (this.instance == null) {
            this.instance = new ChallengeManager();
        }
        return this.instance;
    }

    private pool: Pool;
    private proofTables: string[];
    private proofSelect;
    private categories: NumberOfChallenges;

    private constructor() {
        if (ChallengeManager.instance != null) {
            throw new Error("Database is already instantiated")
        }
        this.pool = mysql.createPool({
            host: "127.0.0.1",
            user: "discord",
            password: process.env.LOCAL_MYSQL_DISCORD_PASSWORD,
            database: "ftf",
        });
        (async () => {
            this.proofTables = (await this.query<{ Tables_in_ftf: string }>("SHOW TABLES"))
                .filter(table => table.Tables_in_ftf.startsWith("preuve"))
                .map(table => table.Tables_in_ftf);
            this.proofSelect = this.proofTables.map(table => {
                    const challenge = table.split("preuve")[1];
                    return `SELECT *, '${challenge[0]}${challenge[1]}' AS 'challenge' FROM ${table} WHERE (found = 0 OR static = true) AND flag = ?`;
                }
            ).join(" UNION ALL ");
            const cats = ["facile", "moyen", "difficile"];
            this.categories = this.proofTables.reduce((acc: { [difficulty: string]: { difficulty: string, challenges: number } }, current: string) => {
                const difficultyId = Number(current.split("preuve")[1][0]);
                if (acc[difficultyId] == null) {
                    acc[difficultyId] = {difficulty: cats[difficultyId - 1], challenges: 0}
                }
                ++acc[difficultyId].challenges;
                return acc;
            }, {});
        })();
    }

    public getDifficulty(difficultyId: number): string {
        return this.categories[difficultyId].difficulty;
    }

    public getDifficulties(): NumberOfChallenges {
        return structuredClone(this.categories);
    }

    public getChallengeTitle(challengeId: string) {
        console.log(challengeId, this.categories)
        return `${this.getDifficulty(Number(challengeId[0]))} n°${challengeId[1]}`;
    }

    public async userExists(id: number): Promise<Boolean> {
        return (await this.query("SELECT id_discord FROM users WHERE id_discord = ?", [id])).length != 0;
    }

    public async addUser(id: number, promo: string) {
        await this.execute(
            "INSERT INTO users (id_discord, promo, bonus_trees, difficulty1, difficulty2, difficulty3, quizz_planete_urgence) VALUES (?, ?, 0, 0, 0, 0, 0)",
            [id, promo]
        );
    }

    public async userAchievesDifficulty(id: number, difficultyId: number) {
        if (difficultyId < 1 || difficultyId > 3) {
            return;
        }
        await this.execute(
            `UPDATE users SET difficulty${difficultyId} = 1 WHERE id_discord = ?`
                [id]);
    }

    public async addLog(discordUserId: number, challengeId: string, flag: string) {
        const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await this.execute(`INSERT INTO logs (id_discord, flag, difficulty, challenge, date) VALUES (?, ?, ?, ?, ?)`, [
            discordUserId, flag, challengeId[0], challengeId[1], datetime]);
    }

    public async getChallengeFromFlag(flag: string): Promise<string | null> {
        let challenges = await this.query<{ flag: string, found: number, static: boolean, challenge: string }>(this.proofSelect, this.proofTables.map(_ => flag));
        if (challenges.length == 0) {
            return null;
        } else if (challenges.length == 1) {
            return challenges[0].challenge;
        } else {
            console.error(`Got more than one challenge for flag ${flag}: ${challenges}`);
            return null;
        }
    }

    public async getAchievedChallenges(discordUserId: number): Promise<string[]> {
        return (await this.query<{ difficulty: number, challenge: number }>(
            `SELECT DISTINCT difficulty, challenge FROM logs WHERE id_discord = ? AND challenge != 0`,
            [discordUserId])).map(value => `${value.difficulty}${value.challenge}`);
    }

    public getChallengesLeft(achieved: string[]): NumberOfChallenges {
        let left = this.getDifficulties();
        for (let challenge of achieved) {
            --left[Number(challenge[0])].challenges;
        }
        return left;
    }

    public getChallengeLeft(achieved: string[], difficultyId: number): number {
        return this.getChallengesLeft(achieved)[difficultyId].challenges;
    }

    private query<T>(query: string, params?: any[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
    }

    private execute(query: string, params?: any[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default ChallengeManager;
