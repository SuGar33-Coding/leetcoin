import { DataTypes, Model } from "../utils/deps.ts";

export class User extends Model {
    static table = "users";

    static timestamps = true;

    static fields = {
        _id: {
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
}