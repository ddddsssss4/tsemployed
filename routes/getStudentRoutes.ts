import  express,{Response , Request} from 'express'
import { getCardData,cardDetails,getCardDataCustom , cardDetailsCustom} from '../controllers/getStudentController';

const router = express.Router();

router.get('/student/data/:teacherId', (req: Request, res: Response) => { 
  getCardData(req, res); 
})
  //@ts-ignore
router.get('/student/cardDetails/:studentId', (req: request, res: Response) => {
  cardDetails(req, res);
});

router.get('/student/data/custom/:teacherId', (req: Request, res: Response) => {
  getCardDataCustom(req, res);
})

router.get('/student/cardDetails/custom/:studentId', (req: Request, res: Response) => {
  cardDetailsCustom(req, res);
})
export default router