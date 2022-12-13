import React, {DragEvent} from "react";
import {ReferenceCollection} from "../utilities/libs/referenceCollection";

export class ReferenceBoard extends React.Component<any, any> {
    private collection!: ReferenceCollection;
    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;
    constructor(props: any) {
        super(props);

        this.canvasRef = React.createRef<HTMLCanvasElement>()
    }


    componentDidMount() {
        const context = this.canvasRef.current!.getContext("2d")!;
        this.collection = new ReferenceCollection(context)
    }

    private onDrop = async (event: DragEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        event.stopPropagation();

        // const drawingContext = (event.target as HTMLCanvasElement).getContext("2d")!;

        if (event.dataTransfer.items) {

            for (const item of event.dataTransfer.items) {

                if (item.kind === "file") {
                    const data = item.getAsFile();

                    if (data) {
                        this.collection.addImage(data);
                    }

                    // if (data) {
                    //     const buffer = await data.arrayBuffer();
                    //     const blob = new Blob([buffer], {type: data.type});
                    //     const url = URL.createObjectURL(blob);
                    //
                    //     let imageToDraw = new Image();
                    //     imageToDraw.onload = () => {
                    //         const
                    //             ctxWidth = drawingContext.canvas.width / 2,
                    //             ctxHeight = drawingContext.canvas.height / 2;
                    //         const
                    //             imgWidth = imageToDraw.naturalWidth,
                    //             imgHeight = imageToDraw.naturalHeight;
                    //
                    //         const ratio = Math.min(1, ctxWidth / imgWidth, ctxHeight / imgHeight);
                    //
                    //         drawingContext.drawImage(imageToDraw, 0, 0, imgWidth*ratio, imgHeight*ratio);
                    //     }
                    //     imageToDraw.src = url;
                    //     imageToDraw.alt = "";
                    // }
                }
            }
        }
    }


    render() {
        return (
            <div className="flex flex-row w-screen h-screen place-content-center place-items-center">
                <canvas ref={this.canvasRef} className="bg-white w-[400px] h-[400px]" width={400} height={400} onDrop={this.onDrop} onDragOver={(ev) => ev.preventDefault()}/>
            </div>
        );
    }
}