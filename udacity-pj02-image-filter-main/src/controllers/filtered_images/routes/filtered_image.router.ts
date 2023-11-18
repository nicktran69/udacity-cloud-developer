import { Router, Request, Response } from 'express';
import { filterImageFromURL, deleteLocalFile} from '../../../util/util';
import { validateImageURL } from '../../../util/validation';

const router: Router = Router();

//get an image from a public url.
router.get('/',
    async (req: Request, res: Response) => {
        const image_url = req.query.image_url.toString();
        if(validateImageURL(image_url)) {
            const imagePath = await filterImageFromURL(image_url);
            res.sendFile(imagePath, function (err) {
                deleteLocalFile(imagePath);
            });
        } else {
            res.status(400).send("RC 400 Error, image_url: " + image_url);
        }
});

export const FilteredImageRouter: Router = router;
