import mysql, {Connection, Pool} from 'mysql';

class Database {
    private static instance;

    public static getInstance(): Database {
        if (this.instance == null) {
            this.instance = new Database();
        }
        return this.instance;
    }

    private pool: Pool;
    private proofTables = ["preuve11", "preuve12", "preuve13", "preuve14", "preuve15", "preuve16", "preuve21", "preuve22", "preuve23", "preuve24", "preuve31", "preuve32"]

    private constructor() {
        if(Database.instance != null){
            throw new Error("Database is already instantiated")
        }
        this.pool = mysql.createPool({
            host: "127.0.0.1",
            user: "discord",
            password: process.env.LOCAL_MYSQL_DISCORD_PASSWORD,
            database: "ftf",
        });
    }

    private proofSelect = this.proofTables.map(table =>
        `SELECT * FROM ${table} WHERE (found = 0 OR static = true) AND flag = ?`
    ).join(" UNION ALL ");

    public async isFlagPresent(flag: string): Promise<boolean> {
        return (await this.query<{ flag: string, found: number, static: boolean }>(this.proofSelect, this.proofTables.map(_ => flag))).length != 0;
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

export default Database;
