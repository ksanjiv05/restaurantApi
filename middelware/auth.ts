// import { NextFunction, Request, Response } from "express";

// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token: string | undefined = req.header("authorization");
//     console.log("token ", token);
//     if (!token)
//       return res.status(403).json({ msg: "please provide valid auth token " });
//     next();
//   } catch (error) {
//     console.log("token error", error);
//     return res.status(500).json({ msg: "please provide valid auth token " });
//   }
// };
import passport from "passport";

// Strategies
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

// Used to create, sign, and verify tokens
import { IUser } from "../interfaces/IUser";
import { SECRET_KEY } from "../config/config";
import User from "../models/User";

// Local strategy with passport mongoose plugin User.authenticate() function
passport.use(new LocalStrategy(User.authenticate()));

// Required for our support for sessions in passport.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Options to specify for my JWT based strategy.
var opts = {};

// Specifies how the jsonwebtoken should be extracted from the incoming request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//Supply the secret key to be using within strategy for the sign-in.
opts.secretOrKey = SECRET_KEY;

// JWT Strategy
export const jwtPassport = passport.use(
  new JwtStrategy(
    opts,
    async (
      jwt_payload: { _id: string },
      done: (arg0: null, arg1: IUser | boolean) => any
    ) => {
      // console.log("jwt_payload", jwt_payload);
      // Search the user with jwt.payload ID field
      try {
        const user = await User.findOne({ _id: jwt_payload._id });
        if (user) {
          return done(null, user);
        }
        // User doesn't exist
        else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Verify an incoming user with jwt strategy we just configured above
export const verifyUser = passport.authenticate("jwt", { session: false });
