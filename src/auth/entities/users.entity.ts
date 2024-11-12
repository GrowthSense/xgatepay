import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, default: 'null' })
    email: string;

    @Column({ nullable: true, default: 'null' })
    phonenumber: string;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ nullable: true })
    zipcode: string;

    @Column({ nullable: true })
    cashtag: string;

    @Column({ nullable: true })
    otp: string;

    @Column({ nullable: true })
    pin: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column()
    publicKey: string

    @Column()
    secretKey: string

    @Column({ nullable: true })
    accessToken: string;

    @Column({ type: String, default: null })
    refreshToken: string;

    @Column({ default: null })
    refreshTokenExpires: string;

}