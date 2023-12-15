import passport from 'passport'
import local from "passport-local";
import UserModel from '../Dao/models/user.model.js'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from '../utils.js'
import CartModel from '../Dao/models/Cart.models.js'
// App ID: 379063

// Client ID: Iv1.fd103c9944c04de5
//secret:466b4241e7d414693981cbc990752f64e2c607c4


const LocalStrategy = local.Strategy;

const initializePassport = () => {

  passport.use("github",new GitHubStrategy(
    {
      clientID: "Iv1.fd103c9944c04de5",
      clientSecret: "466b4241e7d414693981cbc990752f64e2c607c4",
      callbackURL: "http://127.0.0.1:8080/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Aca estoy",profile);
      const email= profile._json.email;
      try {
        const user = await UserModel.findOne({ email});
        console.log("usuario es",user)
        if (user) {
          console.log("User already exits" + email);
          return done(null, user);
        }
let newcart = await new CartModel({ products: [] }).save();

        const newUser = {
          first_name: profile._json.name,
          last_name: "",
          email: profile._json.email,
          age: "",
          password: "",
          cartId: newcart._id,
        };
        const result = await UserModel.create(newUser);
        console.log(result)
        return done(null, result);
      } catch (e) {
        return done("Error to login with github" + e);
      }
    }
  )
);

  passport.use("register",new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exits");
            return done(null, false);
          }
let newcart = await new CartModel({ products: [] }).save();


          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId:newcart._id,
            rol,
          };
          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (e) {
          return done("Error to register " + error);
        }
      }
    )
  );

  //login es el nombre para iniciar con local
  passport.use("login",new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username }).lean().exec();
          if (!user) {
            console.error("User doesnt exist");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            console.error("Password not valid");
            return done(null, false);
          }
          return done(null, user);
        } catch (e) {
          return done("Error Login" + error);
        }
      }
    ))
     passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user);
  })

}

export default initializePassport;
