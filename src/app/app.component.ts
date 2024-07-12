import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetModule } from './modules/budget/budget.module';
import { ModulesModule } from './modules/modules.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ModulesModule, BudgetModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'budget-builder';
}
