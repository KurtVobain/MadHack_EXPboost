import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config"

interface AuthenticatedRequest extends Request {
    userId?: number
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token)
        return res.status(401).json({ error: "Access denied, token missing" })

    jwt.verify(token, config.jwtToken as string, (err, decoded: any) => {
        if (err) return res.status(403).json({ error: "Invalid token" })

        req.userId = decoded.userId
        next()
    })
}
