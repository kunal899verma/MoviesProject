import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: string;
        };
    }>;
    testEndpoint(): Promise<{
        message: string;
    }>;
    testJwt(req: any): Promise<{
        message: string;
        user: any;
        timestamp: string;
    }>;
    getCurrentUser(req: any): Promise<{
        user: {
            id: any;
            email: any;
        };
    }>;
}
