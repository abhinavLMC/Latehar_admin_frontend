import {
  EMPTY_PLACEHOLDER,
  INVALID_INPUT_MSG,
  REQUIRED_MESSAGE,
} from "@constants/AppConstant";
import { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { isObject, startCase } from "lodash";
import Router from "next/router";
import { ALL_API_OBJECT } from '@constants/ApiConstant';
import { message } from 'antd';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getBase64 = (
  file: File,
  compression: number = 1
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Function to handle image files
    const handleImage = (imageResult: string) => {
      const img = new Image();
      img.src = imageResult;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the compressed base64 string
        const compressedBase64 = canvas.toDataURL("image/jpeg", compression);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error("Image loading error"));
      };
    };

    reader.onload = function (): void {
      if (reader.result) {
        // Check the file type
        if (file.type.startsWith("image/")) {
          handleImage(reader.result as string);
        } else if (file.type === "application/pdf") {
          resolve(reader.result as string);
        } else {
          reject(new Error("Unsupported file type"));
        }
      } else {
        resolve(null);
      }
    };

    reader.onerror = function (error): void {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const hexToRGBA = (
  hexOrName: string,
  alpha: number = 1
): string | null => {
  // Named color mapping
  const namedColors: { [key: string]: string } = {
    green: "#00ff00",
    blue: "#0000ff",
    red: "#ff0000",
    white: "#ffffff",
    cyan: "#00ffff",
    silver: "#c0c0c0",
    gray: "#808080",
    grey: "#808080",
    darkblue: "#00008b	",
    black: "#000000",
    lightblue: "#add8e6	",
    orange: "#ffa500",
    purple: "#800080",
    brown: "#a52a2a",
    yellow: "#ffff00	",
    maroon: "#800000",
    lime: "#00ff00",
    magenta: "#ff00ff	",
    olive: "#808000",
    pink: "#ffc0cb	",
    aquamarine: "#7fffd4",
    // Add more named colors as needed
  };

  // Check if the input is a named color
  const hex = hexOrName && namedColors[hexOrName.toLowerCase()];

  // If it's a named color, use the corresponding hex value
  if (hex) {
    hexOrName = hex;
  }

  // Remove '#' if present
  hexOrName = hexOrName.replace("#", "");

  // Handle shorthand hex notation (e.g., #FFF)
  if (hexOrName.length === 3) {
    hexOrName = hexOrName
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse hexadecimal values
  const bigint = parseInt(hexOrName, 16);

  // Extract RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Validate alpha value
  if (alpha < 0 || alpha > 1) {
    console.error("Alpha value must be between 0 and 1");
    return null;
  }

  // Return RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface errTypes {
  response: {
    data: {
      message: string;
      status: number;
    };
  };
}
export const errorMsg = (err: errTypes) => err.response.data;

export const goBack = (url: string) => Router.push(url);

export const addEditTitle = (id: string | null) => `${id ? "Edit" : "Add"}`;

export const filterByStatus = (arr: any) =>
  arr?.filter((item: any) => item.status);
/**
 *
 * @param field : string
 * @returns {required: boolean, type: fieldType, message: string}[]
 */
export const fieldRules = (field?: string | undefined): Rule[] => {
  switch (field) {
    case "email":
      return [
        {
          required: true,
          type: "email",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "text":
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "number":
      return [
        {
          required: true,
          type: "number",
          message: REQUIRED_MESSAGE,
        },
      ];
    case "mobile":
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
        {},
      ];
    case "url":
      return [
        {
          required: true,
          type: "url",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "date":
      return [
        {
          required: true,
          type: "date",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "file":
      return [
        {
          required: false,
          message: "",
        },
      ];
    default:
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
      ];
  }
};

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e.fileList.map(
    (item: {
      size: number;
      name: string;
      uid: string;
      originFileObj: any;
      type: string;
    }) => ({
      name: item.name,
      uid: item.uid,
      file: item.originFileObj,
      size: item.size,
      type: item.type,
    })
  );
};

export const normDate = (
  value: string,
  reverse: boolean = false,
  inputFormat: string = "DD-MM-YYYY",
  outputFormat: string = "DD-MM-YYYY"
) => {
  let dateObj;

  if (value) {
    // Try to parse the input date using the specified input format
    dateObj = dayjs(value, inputFormat);

    // If parsing failed, return null or handle the error as needed
    if (!dateObj.isValid()) {
      console.error("Invalid date format:", value);
      return null;
    }
  } else {
    // If no value is provided, use the current date
    dateObj = dayjs();
  }

  // If reverse is true, return the dayjs object; otherwise, return the formatted string
  return reverse ? dateObj : dateObj.format(outputFormat);
};

export const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const charCode = e.which || e.keyCode;
  const charStr = String.fromCharCode(charCode);

  // Regular expression to check for alphanumeric characters
  const isValidChar = /^[a-zA-Z0-9]$/;

  if (!isValidChar.test(charStr)) {
    e.preventDefault();
  }
};

interface RenderAllDetails {
  [key: string]: any;
}

export const renderAllDetails = (
  obj: RenderAllDetails,
  excludeItems: string[] = ["updatedAt", "createdAt", "id", "createdBy"]
) => {
  const finalData = {} as RenderAllDetails;

  const processObject = (
    inputObj: RenderAllDetails,
    outputObj: RenderAllDetails
  ) => {
    for (const key in inputObj) {
      if (
        ![
          ...excludeItems,
          "updatedAt",
          "createdAt",
          "createdBy",
          "id",
        ].includes(key)
      ) {
        const newKey = startCase(key);
        if (isObject(inputObj[key]) && !Array.isArray(inputObj[key])) {
          processObject(inputObj[key], outputObj);
        } else if (Array.isArray(inputObj[key])) {
          outputObj[newKey] = inputObj[key].join(", ");
        } else {
          outputObj[newKey] = inputObj[key] || EMPTY_PLACEHOLDER;
        }
      }
    }
  };

  processObject(obj, finalData);
  return finalData;
};

export const optionKeys = (data: Record<string, string>) =>
  !!data
    ? Object.keys(data)
        .filter((key) => key.startsWith("option_"))
        .map((key) => data[key])
    : [];

export function removeNonAlphabeticCharacters(str: string): string {
  return str
    .split("")
    .filter((char) => /[a-zA-Z]/.test(char))
    .join("");
}

/**
 * Downloads a prescription PDF by ID
 * @param prescriptionId - The ID of the prescription to download
 * @returns void - Opens the PDF in a new browser tab
 */
export const downloadPrescriptionPdf = (prescriptionId: string): void => {
  if (!prescriptionId) {
    message.error('Prescription ID is required for download');
    return;
  }
  
  // Log the endpoint for debugging
  const url = `${ALL_API_OBJECT["download-prescription-pdf"]}/${prescriptionId}`;
  console.log('Download prescription endpoint:', url);
  
  // Show loading message
  const hideLoading = message.loading('Downloading prescription PDF...', 0);
  
  try {
    // Directly open the URL in a new tab
    const newWindow = window.open(url, '_blank');
    
    // Check if the window was successfully opened
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      message.error('Pop-up blocked! Please allow pop-ups for this site.');
    }
    
    // Hide loading after a short delay
    setTimeout(() => {
      hideLoading();
    }, 1000);
  } catch (error) {
    hideLoading();
    console.error('Error downloading PDF:', error);
    message.error('Error downloading PDF. Please try again.');
  }
};
