import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { User } from './entities';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { AuthResolver } from './resolvers';
import session from 'express-session';
import ExpressMysqlSession from 'express-mysql-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MyContext } from './types';

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

const main = async () => {
    // DB CONNECTION
    const connection = new DataSource({
        type: 'mysql',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: !__prod__,
        logging: !__prod__,
        entities: [User]
    });
    await connection.initialize();

    const app: Application = express();
    const PORT = process.env.PORT;

    // SESSIONS
    const MySQLStore = ExpressMysqlSession(session as any);
    const sessionStore = new MySQLStore({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // MIDDLEWARE
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        })
    );
    app.use(cookieParser());
    app.use(
        session({
            name: COOKIE_NAME,
            secret: process.env.SESSION_SECRET!,
            resave: false,
            cookie: {
                sameSite: 'lax',
                httpOnly: true,
                secure: __prod__,
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10
            },
            store: sessionStore,
            saveUninitialized: false
        })
    );

    // APOLLO SERVER
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AuthResolver]
        }),
        context: ({ req, res }): MyContext => ({ req, res }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    // STARTING THE SERVER
    app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
};

main().catch(error => {
    console.error(error);
});
