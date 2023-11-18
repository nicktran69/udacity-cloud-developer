import fs from "fs";

export function validateImageURL(imageUrl : string) {
    const regex : RegExp = /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi;
    let result;
    if (imageUrl.match(regex)){
      result = {
        match: imageUrl.match(regex)
      }
    } else {
      result = false;
    }
    return result;
  }