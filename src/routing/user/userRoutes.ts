import { AsyncRouter } from "express-async-router";
import { newUserSignup } from "../../controller/newUserSignUpController";
import { Login } from "../../controller/userLoginController";

const router = AsyncRouter();

router.post('/signUp', newUserSignup);
router.post('/login', Login);

export default router;