import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateUtil } from '../core/utils/date.util';
import { BudgetModule } from './budget/budget.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BudgetModule],
    providers: [DateUtil],
    exports: [],
})
export class ModulesModule {}
