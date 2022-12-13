import {ReferenceImage} from "./types/referenceImage";

export class ReferenceCollection {
    private moving: boolean = false;
    private cursorX: number = 0;
    private cursorY: number = 0;
    private prevCursorX: number = 0;
    private prevCursorY: number = 0;
    private offsetX: number = 0
    private offsetY: number = 0
    private currentZ: number = 0
    private currentScale: number = 1;
    private images: ReferenceImage[] = []
    constructor(
        private readonly canvas: CanvasRenderingContext2D,
    ) {
        canvas.canvas.width = canvas.canvas.width * window.devicePixelRatio;
        canvas.canvas.height = canvas.canvas.height * window.devicePixelRatio;

        canvas.canvas.oncontextmenu = () => {
            return false;
        }

        canvas.canvas.addEventListener('mousedown', (ev) => this.onMouseDown(ev));
        canvas.canvas.addEventListener('mouseup', () => this.onMouseUp(), false);
        canvas.canvas.addEventListener('mouseout', () => this.onMouseUp(), false);
        canvas.canvas.addEventListener('mousemove', (ev) => this.onMouseMove(ev), false);
        canvas.canvas.addEventListener('wheel', (ev) => this.onMouseScroll(ev), false);
        this.redraw();
    }

    private onMouseScroll(event: WheelEvent) {
        const deltaY = event.deltaY;
        const scaleAmount = -deltaY / 500;
        this.currentScale = this.currentScale * (1 + scaleAmount);

        const
            box = this.canvas.canvas.getBoundingClientRect();

        const
            distX = (event.pageX - box.left) / this.canvas.canvas.width,
            distY = (event.pageY - box.top) / this.canvas.canvas.height;

        // console.log("distX", distX, "distY", distY)

        const
            trueWidth = this.canvas.canvas.width / this.currentScale,
            trueHeight = this.canvas.canvas.height / this.currentScale;

        const
            unitsZoomedX = trueWidth * scaleAmount,
            unitsZoomedY = trueHeight * scaleAmount;

        const
            unitsAddLeft = unitsZoomedX * distX,
            unitsAddTop = unitsZoomedY * distY;

        this.offsetX -= unitsAddLeft;
        this.offsetY -= unitsAddTop;
    }

    private onMouseMove(event: MouseEvent) {
        if (this.moving) {
            const box = this.canvas.canvas.getBoundingClientRect();
            this.cursorX = event.pageX - box.left;
            this.cursorY = event.pageY - box.top;
            this.offsetX += (this.cursorX - this.prevCursorX) / this.currentScale;
            this.offsetY += (this.cursorY - this.prevCursorY) / this.currentScale;
        }
        this.prevCursorX = this.cursorX;
        this.prevCursorY = this.cursorY;
    }

    private onMouseDown(ev: MouseEvent) {
        if (ev.button === 2) {
            this.moving = true;
        }

        const
            box = this.canvas.canvas.getBoundingClientRect();

        this.cursorX = ev.pageX - box.left;
        this.cursorY = ev.pageY - box.top;
        this.prevCursorX = this.cursorX;
        this.prevCursorY = this.cursorY;

    }

    private onMouseUp() {
        this.moving = false;
    }

    public addImage(image: Blob | ArrayBuffer | File, outlined: boolean = true) {
        this.images.push(new ReferenceImage(image, 0, 0, this.currentZ++, this.currentScale, outlined));

        this.images.sort((img1,img2) => {
            if (img1.z > img2.z) {
                return 1;
            }
            if (img1.z < img2.z) {
                return -1;
            }
            return 0;
        });
    }

    private bufferedRedraw() {
        const buffer = document.createElement("canvas");

        buffer.width = this.canvas.canvas.width;
        buffer.height = this.canvas.canvas.height;

        const ctx = buffer.getContext("2d");

        if (ctx) {
            this._redraw(buffer, ctx);
            this.canvas.clearRect(0,0, this.canvas.canvas.width, this.canvas.canvas.height)
            this.canvas.drawImage(buffer, 0, 0);
        }
        window.requestAnimationFrame(() => this.bufferedRedraw())
    }

    public redraw() {
        window.requestAnimationFrame(() => this.bufferedRedraw())
    }
    private _redraw(buffer: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, buffer.width, buffer.height);
        for (const image of this.images) {
            image.draw(context, this.offsetX, this.offsetY, this.currentScale);
        }
    }

}