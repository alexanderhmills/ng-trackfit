import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { Food } from 'src/app/core/models/food.model';
import { FoodDataService } from '../food-data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-daily-progress-list',
  templateUrl: './daily-progress-list.component.html',
  styleUrls: ['./daily-progress-list.component.css'],
})
export class DailyProgressListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('foodsSelect') foodsSelect!: MatSelectionList;
  @Input() maxCalories = 1800;
  foodsForm!: FormGroup;
  allFoodsSelected = false;
  maxFoodsDisplayed = 3;
  unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private foodDataService: FoodDataService
  ) {
    this.foodsForm = this.fb.group({
      foods: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.foodDataService.todaysFood
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((foods: Food[]) => {
        this.foodsFormArray.clear();

        foods.map((food: Food) => {
          this.addNewFood(food);
        });
        this.resetDefaults();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // for progress bar
  get currentCalories(): number {
    return this.foodsFormArray.controls.reduce((prev, curr) => {
      return prev + +curr.value.calories;
    }, 0);
  }

  get remainingCalories(): number {
    return this.maxCalories - this.currentCalories;
  }

  get percentOfDaily(): number {
    return (this.currentCalories / this.maxCalories) * 100;
  }

  // for select-all
  anySelected(): boolean {
    return this.foodsSelect?.selectedOptions.selected.length > 0 || false;
  }

  deleteSelected(): void {
    const selectedOptions = this.foodsSelect.selectedOptions;
    const selectedFoods = selectedOptions.selected.map(
      (option) => option.value.value
    );

    const allFoods = this.foodsFormArray.controls.map(
      (option, index) => option.value
    );
    const remainingFoods = allFoods.filter(
      (option) => !selectedFoods.includes(option)
    );

    const idsToDelete = selectedFoods.map((food) => food.id);

    this.foodDataService.deleteFoods(idsToDelete, remainingFoods);
  }

  selectAllChange(): void {
    this.allFoodsSelected = !this.allFoodsSelected;

    if (!this.allFoodsSelected) {
      this.foodsSelect.deselectAll();
      this.maxFoodsDisplayed = 3;
      return;
    }

    this.maxFoodsDisplayed = this.listLength;
    setTimeout(() => {
      this.foodsSelect.selectAll();
    });
  }

  // form methods
  get foodsFormArray(): FormArray {
    return this.foodsForm.get('foods') as FormArray;
  }

  get listLength(): number {
    return this.foodsFormArray.controls.length;
  }

  addNewFood(food: Food): void {
    this.foodsFormArray.push(this.newFoodFormGroup(food));
  }

  removeFood(index: number): void {
    this.foodsFormArray.removeAt(index);
  }

  newFoodFormGroup(food: Food): FormGroup {
    const newFoodGroup = this.fb.group({
      id: [food.id],
      date: [food.date],
      time: [
        this.datePipe.transform(food.date, 'HH:mm'),
        [Validators.required],
      ],
      name: [food.name, Validators.required],
      calories: [
        food.calories,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(4),
        ],
      ],
    });

    newFoodGroup.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((formValue) => {
          console.log('update food');
          return this.foodDataService.saveFood(formValue);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        console.log(value);
      });

    return newFoodGroup;
  }

  resetDefaults(): void {
    this.allFoodsSelected = false;
    this.maxFoodsDisplayed = 3;
    this.foodsSelect.deselectAll();
  }

  optionClick(): void {
    let newStatus = true;
    this.foodsSelect.options.forEach((item: MatListOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allFoodsSelected = newStatus;
  }

  loadMore(): void {
    if (this.listLength > this.maxFoodsDisplayed) {
      this.maxFoodsDisplayed += 3;
    }
  }

  loadReset(): void {
    this.maxFoodsDisplayed = 3;
  }
}
