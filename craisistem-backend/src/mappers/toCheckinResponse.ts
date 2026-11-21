import { getPhotoUrl } from "../utils/photo-url";
import { Checkin } from "../models/checkin.entity";
import { TCheckinResponse } from "../models/types/ICheckin";


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