import { body } from "express-validator";
import HttpException from "../../common/http-exception";

export const attandanceValidtaor = [
     body("photo").notEmpty().withMessage("Ambil foto untuk absensi"),
     body("location").notEmpty().withMessage("Pilih Lokasi absensi"),
     body("tagLocation").notEmpty().withMessage("Pilih tag lokasi untuk absensi"),
     body("location").custom(async (value, { req }) => {
          const location = value;
          if (!location || !location.latitude || !location.longitude) {
               throw new HttpException({ message: "Lokasi tidak valid", statusCode: 400 });
          }
     }),
];
