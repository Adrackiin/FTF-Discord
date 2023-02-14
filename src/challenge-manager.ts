import mysql, {Pool} from 'mysql';

class ChallengeManager {
    private static instance;

    public static getInstance(): ChallengeManager {
        if (this.instance == null) {
            this.instance = new ChallengeManager();
        }
        return this.instance;
    }

    private pool: Pool;
    private proofTables = ["preuve11", "preuve12", "preuve13", "preuve14", "preuve15", "preuve16", "preuve21", "preuve22", "preuve23", "preuve24", "preuve31", "preuve32"]

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
    }

    private proofSelect = this.proofTables.map(table => {
            const challenge = table.split("preuve")[1];
            return `SELECT *, '${challenge[0]}${challenge[1]}' AS 'challenge' FROM ${table} WHERE (found = 0 OR static = true) AND flag = ?`;
        }
    ).join(" UNION ALL ");

    private categories = ["Facile", "Moyen", "Difficile"];
    public getChallengeTitle(challengeId: string){
        return `${this.categories[Number(challengeId[0]) - 1]} n°${challengeId[1]}`;
    }

    public async addLog(discordUserId: number, challengeId: string, flag: string){
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

    public async getAchievedChallenges(discordUserId: number) : Promise<string[]>{
        return (await this.query<{difficulty: number, challenge: number}>(
            `SELECT DISTINCT difficulty, challenge FROM logs WHERE id_discord = ? AND challenge != 0`,
            [discordUserId])).map(value => `${value.difficulty}${value.challenge}`);
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
