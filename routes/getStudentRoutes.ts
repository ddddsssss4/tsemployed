import  express,{Response , Request} from 'express'
import { cardData,cardDetails} from '../controllers/getStudentController';

const router = express.Router();

router.get('/student/data/:teacherId/:languageModelId', (req: Request, res: Response) => { 
  cardData(req, res); 
})
  //@ts-ignore
router.get('/student/cardDetails/:studentId/:languageModelId', (req: request, res: Response) => {
  cardDetails(req, res);
});

// router.get('/student/data/custom/:teacherId', (req: Request, res: Response) => {
//   getCardDataCustom(req, res);
// })

// router.get('/student/cardDetails/custom/:studentId', (req: Request, res: Response) => {
//   cardDetailsCustom(req, res);
// })
export default router