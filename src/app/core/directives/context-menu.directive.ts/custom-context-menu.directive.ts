import { Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appCustomContextMenu]',
    standalone: true,
})
export class CustomContextMenuDirective {
    @Input('appCustomContextMenu') menuTemplate!: TemplateRef<any>;
    @Input() paramsContextMenu!: any;
    private contextMenuElement: HTMLElement | null = null;

    constructor(private renderer: Renderer2, private el: ElementRef, private viewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        this.contextMenuElement = this.renderer.createElement('div');
        this.renderer.setStyle(this.contextMenuElement, 'position', 'absolute');
        this.renderer.setStyle(this.contextMenuElement, 'display', 'none');
        this.renderer.setStyle(this.contextMenuElement, 'background', '#fff');
        this.renderer.setStyle(this.contextMenuElement, 'boxShadow', '0 2px 10px rgba(0,0,0,0.2)');
        this.renderer.setStyle(this.contextMenuElement, 'borderRadius', '6px');
        this.renderer.setStyle(this.contextMenuElement, 'zIndex', '1000');

        if (this.menuTemplate) {
            const view = this.viewContainerRef.createEmbeddedView(this.menuTemplate, {
                $implicit: {
                    ...this.paramsContextMenu,
                },
            });
            view.rootNodes.forEach((node) => this.renderer.appendChild(this.contextMenuElement, node));
        }

        this.renderer.appendChild(document.body, this.contextMenuElement);
    }

    ngOnDestroy() {
        if (this.contextMenuElement) {
            this.renderer.removeChild(document.body, this.contextMenuElement);
        }
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        event.preventDefault();
        this.showContextMenu(event.clientX, event.clientY);
    }

    private showContextMenu(x: number, y: number) {
        if (this.contextMenuElement) {
            this.renderer.setStyle(this.contextMenuElement, 'top', `${y}px`);
            this.renderer.setStyle(this.contextMenuElement, 'left', `${x}px`);
            this.renderer.setStyle(this.contextMenuElement, 'display', 'block');
            document.addEventListener('click', this.closeContextMenu);
        }
    }

    private closeContextMenu = (event: MouseEvent) => {
        if (this.contextMenuElement) {
            this.renderer.setStyle(this.contextMenuElement, 'display', 'none');
            document.removeEventListener('click', this.closeContextMenu);
        }
    };
}
