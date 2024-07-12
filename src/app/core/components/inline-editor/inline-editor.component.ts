import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-inline-editor',
    templateUrl: './inline-editor.component.html',
    styleUrl: './inline-editor.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InlineEditorComponent),
            multi: true,
        },
    ],
})
export class InlineEditorComponent {
    @Input() isReadOnly: boolean | undefined = false;
    public value: string = '';
    public isFocusing: boolean = false;

    constructor() {}

    public propagateOnChange = (value: any) => {};
    public propagateTouched = () => {};

    public registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    public registerOnTouched(fn: any) {
        this.propagateTouched = fn;
    }

    public writeValue(value: string) {
        this.value = value || '';
    }

    public onFocusInput(event: Event): void {
        this.isFocusing = true;
        console.log('onFocusInput', this.isFocusing);
    }

    public onBlurInput(event: Event): void {
        this.isFocusing = false;
        this.propagateOnChange(this.value);
        this.propagateTouched();
    }
}
