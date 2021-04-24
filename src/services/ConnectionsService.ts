import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { User } from "../entities/User";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
    user_id: string;
    socket_id: string;
    admin_id?: string;
    id?: string;
}

class ConnectionsService {

    private connectionsRepository: Repository<Connection>;

    constructor() {
        this.connectionsRepository = getCustomRepository(ConnectionsRepository);
    }

    async create({ user_id, socket_id, admin_id, id } : IConnectionCreate) {

        const connection = await this.connectionsRepository.create({
            user_id,
            socket_id,
            admin_id,
            id,
        });

        await this.connectionsRepository.save(connection);

        return connection;

    }

    async findByUserID(user_id: string) {

        return await this.connectionsRepository.findOne({ user_id });

    }

    async findAllWithoutAdmin() {
        const connections = await this.connectionsRepository.find({
            where: { admin_id: null },
            relations: ["user"],
        });

        return connections;
    }

    async findBySocketID(socket_id: string) {
        const connection = await this.connectionsRepository.findOne({
            socket_id,
        });

        return connection;
    }

    async updateAdminID(user_id: string, admin_id: string) {
        await this.connectionsRepository
        .createQueryBuilder()
        .update(Connection)
        .set({ admin_id })
        .where("user_id = :user_id", {
            user_id,
        })
        .execute();
    }

}

export { ConnectionsService };