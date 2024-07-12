export function DebounceDecorator(delay = 500) {
    let timerId: any = null;
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const context = this;
            clearTimeout(timerId);
            timerId = setTimeout(() => originalMethod.apply(context, args), delay);
        };
    };
}
