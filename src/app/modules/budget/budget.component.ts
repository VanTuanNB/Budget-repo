import { Component } from '@angular/core';
import { DebounceDecorator } from '../../core/decorators/debounce.decorator';
import { DateUtil } from '../../core/utils/date.util';

type TypeSummary = {
    profitOrLoss: number[];
    openingBalance: number[];
    closingBalance: number[];
};

type TypeMonthHead = {
    id: number;
    title: string;
};

type TypeCategory = {
    id: number;
    title: string;
    subCategories: TypeSubCategory[];
};

type TypeSubCategory = {
    id: number;
    title: string;
    monthValues: number[];
    isReadOnly?: boolean;
    isFocusing?: boolean;
};

type TypeBudget = {
    id: number;
    title: string;
    backgroundColor: string;
    total: number[];
    categories: TypeCategory[];
};

@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.scss',
})
export class BudgetComponent {
    public startMonth = 1;
    public endMonth = 12;
    public date: Date[] = [new Date(), new Date()];
    public months: TypeMonthHead[] = [
        {
            id: 1,
            title: 'January',
        },
        {
            id: 2,
            title: 'Feb',
        },
        {
            id: 3,
            title: 'Mar',
        },
        {
            id: 4,
            title: 'Apr',
        },
        {
            id: 5,
            title: 'May',
        },
        {
            id: 6,
            title: 'Jun',
        },
        {
            id: 7,
            title: 'Jul',
        },
        {
            id: 8,
            title: 'Aug',
        },
        {
            id: 9,
            title: 'Sep',
        },
        {
            id: 10,
            title: 'Oct',
        },
        {
            id: 11,
            title: 'Nov',
        },
        {
            id: 12,
            title: 'Dec',
        },
    ];
    public budgets: TypeBudget[] = [
        {
            id: 0,
            title: 'Income:',
            backgroundColor: '#d1f1ec',
            total: this.getDefaultValuesByMonthNumber(),
            categories: [],
        },
        {
            id: 1,
            title: 'Expense:',
            backgroundColor: '#c5dbff',
            total: this.getDefaultValuesByMonthNumber(),
            categories: [],
        },
    ];
    public summary: TypeSummary = {
        profitOrLoss: this.getDefaultValuesByMonthNumber(),
        closingBalance: this.getDefaultValuesByMonthNumber(),
        openingBalance: this.getDefaultValuesByMonthNumber(),
    };
    constructor(private dateUtil: DateUtil) {}

    private getDefaultValuesByMonthNumber() {
        return Array(this.endMonth).fill(0);
    }

    // public renderRowByMonthNumber(items: any[], start: number, end: number) {
    //     return items.slice(start - 1, end);
    // }

    // public onChange(data: any) {
    //     this.startMonth = this.dateUtil.getMonth(data[0]);
    //     this.endMonth = this.dateUtil.getMonth(data[1]);
    // }

    public trackByFn(index: any, item: any) {
        return index;
    }

    private getParentElementByTagName<R = HTMLElement, T = HTMLDivElement>(
        tagName: string,
        target: HTMLElement,
    ): T | null {
        let parent: HTMLElement | null = target;
        while (parent) {
            if (parent.tagName.toLowerCase() === tagName.toLowerCase()) {
                return parent as T;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    @DebounceDecorator(300)
    public onEnterInputEvent(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            const parentElement = this.getParentElementByTagName('nz-input-number', input);
            if (parentElement) {
                const categoryId = Number(parentElement.getAttribute('data-parent-category-id'));
                const budgetId = Number(parentElement.getAttribute('data-budget-id'));
                const currentLengthSubCategories =
                    this.budgets[budgetId].categories[categoryId].subCategories.length - 1;
                this.budgets[budgetId].categories[categoryId].subCategories.splice(currentLengthSubCategories, 0, {
                    id: currentLengthSubCategories,
                    title: 'New sub category',
                    monthValues: this.getDefaultValuesByMonthNumber(),
                });
            }
        }
    }

    public onCreateNewCategory(budgetId: number): void {
        const currentBudget = this.budgets.find((budget) => budget.id === budgetId);
        const preCategory = currentBudget?.categories[currentBudget?.categories.length - 1];
        const newCategoryId = preCategory ? preCategory.id : -1;
        const newCategory = {
            id: newCategoryId + 1,
            title: 'New Category',
            subCategories: [
                {
                    id: 0,
                    title: 'New sub category',
                    monthValues: this.getDefaultValuesByMonthNumber(),
                },
                {
                    id: 1,
                    title: 'Subtotal',
                    monthValues: this.getDefaultValuesByMonthNumber(),
                    isReadOnly: true,
                },
            ],
        };
        this.budgets[budgetId].categories.push(newCategory);
    }

    public onInputChange(budgetId: number, categoryId: number, indexInput: number): void {
        const category = this.budgets[budgetId].categories[categoryId];
        const subtotal = category.subCategories.reduce((acc, cur) => {
            if (cur.isReadOnly) return acc; //is col subtotal
            acc += cur.monthValues[indexInput];
            return acc;
        }, 0);
        const subtotalIndex = this.budgets[budgetId].categories[categoryId].subCategories.length - 1;
        this.budgets[budgetId].categories[categoryId].subCategories[subtotalIndex].monthValues.splice(
            indexInput,
            1,
            subtotal,
        );
        this.calculateTotalOfBudge(budgetId, indexInput);
        this.calculateProfitOrLoss(indexInput);
    }

    public onApplyToAllCol(
        event: Event,
        data: { indexCol: number; budgetId: number; categoryId: number; subCategoryId: number },
    ): void {
        const { indexCol, budgetId, categoryId, subCategoryId } = data;
        const valueInput =
            this.budgets[budgetId].categories[categoryId].subCategories[subCategoryId].monthValues[indexCol];
        this.budgets.forEach((budget, indexBudget) => {
            budget.categories.forEach((category, indexCategory) => {
                category.subCategories.forEach((subCategory) => {
                    if (!subCategory.isReadOnly) {
                        subCategory.monthValues.splice(indexCol, 1, valueInput);
                    }
                });
                const subtotal = category.subCategories.reduce((acc, cur) => {
                    if (cur.isReadOnly) return acc; //is col subtotal
                    acc += cur.monthValues[indexCol];
                    return acc;
                }, 0);
                const subtotalIndex = this.budgets[indexBudget].categories[indexCategory].subCategories.length - 1;
                this.budgets[indexBudget].categories[indexCategory].subCategories[subtotalIndex].monthValues.splice(
                    indexCol,
                    1,
                    subtotal,
                );
            });
            this.calculateTotalOfBudge(budget.id, indexCol);
            this.calculateProfitOrLoss(indexCol);
        });
    }

    public onDeleteRow(budgetId: number, categoryId: number, subCategoryId: number) {
        const category = this.budgets[budgetId].categories[categoryId];
        const subcategoryDeletedId = category.subCategories.findIndex((sub) => sub.id === subCategoryId);
        const subtractSubTotals = category.subCategories[category.subCategories.length - 1].monthValues.map(
            (subTotalValue, index) => {
                return Number(subTotalValue) - Number(category.subCategories[subCategoryId].monthValues[index]);
            },
        );
        category.subCategories[category.subCategories.length - 1].monthValues = subtractSubTotals;
        category.subCategories.splice(subcategoryDeletedId, 1);
        for (let i = 0; i <= 11; i++) {
            this.calculateTotalOfBudge(budgetId, i);
            this.calculateProfitOrLoss(i);
        }
    }

    private calculateTotalOfBudge(budgetId: number, indexInput: number) {
        const total = this.budgets[budgetId].categories.reduce((acc, cur) => {
            const totalSubcategory = cur.subCategories[cur.subCategories.length - 1].monthValues[indexInput];
            acc += totalSubcategory;
            return acc;
        }, 0);
        this.budgets[budgetId].total.splice(indexInput, 1, total);
    }

    private calculateProfitOrLoss(indexInput: number) {
        const profitOrLoss = this.budgets.reduce((acc, cur) => {
            if (!acc) return (acc = cur.total[indexInput]);
            return acc - cur.total[indexInput];
        }, 0);
        this.summary.profitOrLoss.splice(indexInput, 1, profitOrLoss);
        this.calculateClosingBalance(indexInput);
    }

    private calculateClosingBalance(indexInput: number) {
        const profitOrLoss = this.summary.profitOrLoss[indexInput];
        const openingBalance = this.summary.openingBalance[indexInput];
        const closingBalance = profitOrLoss + openingBalance;
        this.summary.closingBalance.splice(indexInput, 1, closingBalance);
        this.summary.openingBalance.splice(indexInput + 1, 1, closingBalance);
    }
}
