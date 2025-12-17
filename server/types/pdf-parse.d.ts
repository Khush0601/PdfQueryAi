declare module "pdf-parse" {
  export class PDFParse {
    constructor(options: { data?: Buffer | ArrayBuffer | Uint8Array; url?: string | URL });
    getText(params?: ParseParameters): Promise<TextResult>;
    getInfo(params?: ParseParameters): Promise<any>;
    getImage(params?: ParseParameters): Promise<any>;
    getTable(params?: ParseParameters): Promise<any>;
    getScreenshot(params?: ParseParameters): Promise<any>;
    destroy(): Promise<void>;
  }

  export interface TextResult {
    text: string;
    pages: PageTextResult[];
    total: number;
    getPageText(num: number): string;
  }

  export interface PageTextResult {
    num: number;
    text: string;
  }

  export interface ParseParameters {
    pages?: string | number[];
    first?: number;
    last?: number;
    parsePageInfo?: boolean;
    [key: string]: any;
  }
}
