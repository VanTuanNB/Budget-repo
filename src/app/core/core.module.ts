import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { InlineEditorComponent } from './components/inline-editor/inline-editor.component';
import { CustomContextMenuDirective } from './directives/context-menu.directive.ts/custom-context-menu.directive';

@NgModule({
    declarations: [InlineEditorComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule],
    exports: [InlineEditorComponent],
    providers: [CustomContextMenuDirective],
})
export class CoreModule {}
