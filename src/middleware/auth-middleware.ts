import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { verifyToken } from "../utils/auth";
import { findUserById } from "../services/user-service";

type SafeUser = Omit<User, 'passwordHash'>;

export interface AuthenticatedRequest extends Request {
    user?: SafeUser;
}

export const authenticate = async (
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const token = req.cookies.token;

    const isApiRoute = req.originalUrl.startsWith("/api/");

    const unauthorized = (message: string) => {
        if (isApiRoute) {
            res.status(401).json({ message });
        } else {
            res.redirect("/login");
        }
    };

    if (!token) {
        unauthorized("Authentication required.");
        return;
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            res.clearCookie('token');
            unauthorized("Invalid or expired token.");
            return;
        }

        const user = await findUserById(decoded.id);

        if (!user) {
            res.clearCookie('token');
            unauthorized("User not found.");
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.clearCookie("token");
        unauthorized("Authentication error.");
        return;
    }
};