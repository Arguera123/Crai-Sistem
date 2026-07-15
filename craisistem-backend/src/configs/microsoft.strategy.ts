import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { microsoftConfig } from "./microsoft.config";
import { UserRepository } from "../repository/user.repository";

const userRepository = new UserRepository();

passport.use(
  "auth-microsoft",
  new MicrosoftStrategy(
    {
      clientID: microsoftConfig.clientID,
      clientSecret: microsoftConfig.clientSecret,
      callbackURL: microsoftConfig.callbackURL,
      tenant: microsoftConfig.tenant,
      scope: ["user.read"],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(null, false, { message: "No se pudo obtener el correo institucional de la cuenta Microsoft." });
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
          return done(null, false, { message: "El usuario no se encuentra registrado en el sistema." });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);