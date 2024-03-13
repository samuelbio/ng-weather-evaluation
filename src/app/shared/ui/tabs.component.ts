import {
    Component,
    ContentChildren,
    EventEmitter, OnDestroy,
    Output,
    QueryList
} from '@angular/core';
import {TabComponent} from './tab.component';
import {NgForOf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject, Subscription} from 'rxjs';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [NgForOf],
    template: `
        <div class="tabs">
            <div class="tabs__header"
             *ngFor="let tab of tabs; let i = index"
             [class.active]="tab.active"
             (click)="selectTab(tab)"
            >
                <div class="tabs__title">
                    <h4>{{ tab.title }}</h4>
                    <span class="close" (click)="close.emit(i)">&times;</span>
                </div>
            </div>
            <div class="tabs__content">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styles: `
        .tabs__header {
            cursor: pointer;
            display: inline-block;
            padding: .625em;
        }
        
        .tabs__title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1em;
        }

        .tabs__header.active {
            background-color: #337ab7;
            color: #fff;
        }
        
        .tabs__content {
            padding: 1em;
            border: 1px solid whitesmoke;
        }
    `
})

export class TabsComponent implements OnDestroy {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @Output() close: EventEmitter<number> = new EventEmitter<number>();

    subscription: Subscription = new Subscription();

    ngAfterContentInit() {
        this.subscription =this.tabs.changes.subscribe(
            () => setTimeout(() => this.selectTab(this.tabs.first))
        )

        if (this.tabs.length > 0) {
            setTimeout(() => this.selectTab(this.tabs.first))
        }
    }

    selectTab(tab: TabComponent) {
        this.tabs.toArray().forEach(t => t.active = false);
        tab.active = true;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
