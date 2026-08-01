import { Checkin } from "../models/checkin.entity";
import { TCheckinResponse } from "../models/types/ICheckin";
import { saveBase64Image } from "../utils/saveBase64Image";

const getPhotoUrl = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null;
  
  const baseUrl = process.env.API_URL || 'http://localhost:8080';
  return `${baseUrl}${photoPath}`;
};

export const toCheckinResponse = (
  checkin: Checkin
): TCheckinResponse => {
  return {
    id: checkin.user.id,
    firstName: checkin.user.firstName,
    lastName: checkin.user.lastName,
    date: checkin.date,
    time: checkin.time,
    photo: getPhotoUrl(checkin.user.photo)
  }
}