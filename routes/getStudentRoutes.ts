import  express,{Response , Request} from 'express'

import { getCardData,cardDetails} from '../controllers/getStudentController';
const router = express.Router();

router.get('/student/data/:teacherId', (req: Request, res: Response) => { 
  getCardData(req, res); 
})
  //@ts-ignore
router.get('/student/cardDetails/:studentId', (req: request, res: Response) => {
  cardDetails(req, res);
});
export default router