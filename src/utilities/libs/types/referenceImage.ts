export class ReferenceImage {
    private readonly blobURL: string;
    private readonly image: HTMLImageElement;

    constructor(
        data: Blob | ArrayBuffer | File,
        private x: number,
        private y: number,
        public z: number,
        private scale: number,
        private outlined: boolean,
        private selected: boolean = false,

    ) {
        let buffer: ArrayBuffer | undefined;
        let url: string;

        if (data instanceof File) {
            data.arrayBuffer().then(buf => buffer = buf);
        }

        if (data instanceof ArrayBuffer) {
            buffer = data;
        }
        // If there is an ArrayBuffer, we're either a File or ArrayBuffer :D
        if (buffer) {
            const blob = new Blob([buffer])
            url = URL.createObjectURL(blob);
        } else {
            url = URL.createObjectURL(data as Blob);
        }

        this.blobURL = url;

        this.image = new Image();
        this.image.loading = "eager";
        this.image.src = this.blobURL;
        this.image.alt = "";
    }

    public getScreenX(offsetX: number, scale: number = this.scale) {
        return (this.x + offsetX) * scale;
    }
    public getScreenY(offsetY: number, scale: number = this.scale) {
        return (this.y + offsetY) * scale;
    }

    public draw(canvas: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number = this.scale) {
        this.scale = scale;
        const
            ctxWidth = canvas.canvas.width,
            ctxHeight = canvas.canvas.height;
        const
            imgWidth = this.image.naturalWidth,
            imgHeight = this.image.naturalHeight;

        const
            screenX = this.getScreenX(offsetX, scale),
            screenY = this.getScreenY(offsetY, scale);
        
        const ratio = Math.min(1, ctxWidth / imgWidth, ctxHeight / imgHeight);

        // console.log("ratio", ratio, "scale", scale, "dw", imgWidth*ratio*scale, "dh", imgHeight*ratio*scale)
        if (!(screenX < 0 || screenX > ctxWidth || screenY < 0 || screenY > ctxHeight)) {
            canvas.drawImage(this.image, screenX, screenY, imgWidth*ratio*scale, imgHeight*ratio*scale)

            if (this.outlined || this.selected) {
                canvas.beginPath();
                canvas.strokeStyle = '#75dc62';
                canvas.lineWidth = 8;
                canvas.strokeRect(screenX, screenY, imgWidth*ratio*scale, imgHeight*ratio*scale)
            }
        }
    }
}