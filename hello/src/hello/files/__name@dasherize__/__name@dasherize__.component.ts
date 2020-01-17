import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@app/shared/services/user.service';
import {CustomTableService} from '@app/shared/services/custom-table.service';
import {DropdownService} from '@app/shared/services/dropdown.service';
import {BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
    styleUrls: ['./<%= dasherize(name) %>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {
    public mode: any = {
        heading: ''
    };
    public isSendingRequest: boolean;

    public brokers$: Observable<any[]>;
    public countries$: Observable<any[]>;
    public form: FormGroup;

    public bannedBrokersList: any;
    public tableHeads: any;
    public tableName = '<%= classify(tableName) %>';
    public currentPage;
    public sortBy: any;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public userService: UserService,
        private _customTableService: CustomTableService,
        private _dropdownService: DropdownService,
        private _modalService: BsModalService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _fb: FormBuilder
    ) {
        this.tableHeads = '<%= classify(tableHead) %>';
        this.form = this._fb.group({
            broker: [null],
            country: [null]
        });
        this._route.data
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((data) => {
                this.mode.heading = data.heading;
            });
    }

    ngOnInit() {
        this.brokers$ = this._dropdownService.getBrokers();
        this.countries$ = this._dropdownService.getCountries();
        this.onFilter();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onFilter(params?) {
        this.isSendingRequest = true;
        if (!params) {
            params = {
                'per-page': this._customTableService.getSelectedPerPageForTable(this.tableName),
                'page': 1,
                'sort': this.sortBy
            };
        }
        this.currentPage = params['page'];
    }

    onSortClick(event) {
        this.sortBy = event;
        this.onFilter({'per-page': this._customTableService.getSelectedPerPageForTable(this.tableName), 'page': 1, 'sort': event});
    }
}
