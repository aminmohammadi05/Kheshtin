export class ProductFile {
    productId!: string;
    productFileId!: number;
    parentProductFileId!: number;
    fileType!: number;
    reservedField1!: number;
    reservedField2!: string;
    reservedField3!: string;
    reservedField4!: string;
    reservedField5!: string;
    name!: string;
    color!: string;
    material!: string;
    thumbnail!: string;
    fileExtension!: string;
    file!: string;
    size!: number;
    parentProductFile!: ProductFile;
    childrenProductFiles: ProductFile[] = [];
}
