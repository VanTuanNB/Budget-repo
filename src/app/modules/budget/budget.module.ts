import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconTestModule } from 'ng-zorro-antd/icon/testing';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CoreModule } from '../../core/core.module';
import { CustomContextMenuDirective } from '../../core/directives/context-menu.directive.ts/custom-context-menu.directive';
import { BudgetComponent } from './budget.component';

@NgModule({
    declarations: [BudgetComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzDatePickerModule,
        NzTableModule,
        NzInputNumberModule,
        NzIconTestModule,
        NzButtonModule,
        NzModalModule,
        NzDrawerModule,
        CoreModule,
        CustomContextMenuDirective,
    ],
    exports: [BudgetComponent],
})
export class BudgetModule {}
