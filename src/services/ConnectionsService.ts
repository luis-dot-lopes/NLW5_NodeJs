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
}

export { ConnectionsService };