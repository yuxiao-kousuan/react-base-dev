import { action, makeAutoObservable } from 'mobx';

export class WelcomePageStore {
    constructor() {
        makeAutoObservable(this);
    }

    isVisible = false;

    @action setIsVisible(isVisible: boolean) {
        this.isVisible = isVisible;
    }
}

export default new WelcomePageStore();