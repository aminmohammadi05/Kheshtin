import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CustomMatPaginatorInt } from './custom-mat-paginator-int';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
  suppressScrollX: true
};

import { PipesModule } from '../theme/pipes/pipes.module';
import { DirectivesModule } from '../theme/directives/directives.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HeaderImageComponent } from './header-image/header-image.component';
import { HeaderCarouselComponent } from './header-carousel/header-carousel.component';
import { PropertyItemComponent } from './property-item/property-item.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { LoadMoreComponent } from './load-more/load-more.component';
import { PropertiesToolbarComponent } from './properties-toolbar/properties-toolbar.component';
import { PropertiesSearchComponent } from './properties-search/properties-search.component';
import { CompareOverviewComponent } from './compare-overview/compare-overview.component';
import { RatingComponent } from './rating/rating.component';
import { PropertiesSearchResultsFiltersComponent } from './properties-search-results-filters/properties-search-results-filters.component';
import { PropertiesCarouselComponent } from './properties-carousel/properties-carousel.component';
import { BrandsCarouselComponent } from './brands-carousel/brands-carousel.component';
import { GetInTouchComponent } from './get-in-touch/get-in-touch.component';
import { CommentsComponent } from './comments/comments.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { OurAgentsComponent } from './our-agents/our-agents.component';
import { MissionComponent } from './mission/mission.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { LogoComponent } from './logo/logo.component';
import { ProjectsSearchResultsFiltersComponent } from './projects-search-results-filters/projects-search-results-filters.component';
import { ProjectsSearchComponent } from './projects-search/projects-search.component';
import { BrandItemComponent } from './brand-item/brand-item.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { CategoriesComponent } from '../pages/categories/categories.component';
import { SafeHtmlPipe } from '../theme/pipes/safe-html.pipe';
import { CategoriesQuickAccessComponent } from './categories-quick-access/categories-quick-access.component';
import { ProductFilesComponent } from './product-files/product-files.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';
import { ProjectsCarouselComponent } from './projects-carousel/projects-carousel.component';
import { BrandsSearchComponent } from './brands-search/brands-search.component';
import { BrandsSearchResultsFiltersComponent } from './brands-search-results-filters/brands-search-results-filters.component';
import { BlogsSearchComponent } from './blogs-search/blogs-search.component';
import { MoodBoardsSearchResultsFiltersComponent } from './mood-boards-search-results-filters/mood-boards-search-results-filters.component';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { FileTypePipe } from '../theme/pipes/file-type.pipe';
import { FileValueAccessorDirective } from '../theme/directives/file-value-accessor.directive';
import { FileValidatorDirective } from '../theme/directives/file-validator.directive';
import { PagePipe } from '../theme/pipes/page.pipe';
import { InputFileModule } from 'ngx-input-file';
import { DesignOfficesSearchComponent } from './design-offices-search/design-offices-search.component';
import { OfficeProjectsSearchComponent } from './office-projects-search/office-projects-search.component';
import { DesignOfficesSearchResultsFiltersComponent
        } from './design-offices-search-results-filters/design-offices-search-results-filters.component';
import { OfficeProjectsSearchResultsFiltersComponent
        } from './office-projects-search-results-filters/office-projects-search-results-filters.component';
import { OfficeProjectsComponent } from '../pages/office-projects/office-projects.component';
import { OfficeProjectItemComponent } from './office-project-item/office-project-item.component';
import { DesignOfficeItemComponent } from './design-office-item/design-office-item.component';
import { OfficeProjectCategoriesComponent } from './office-project-categories/office-project-categories.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import { OfficeProjectsCarouselComponent } from './office-projects-carousel/office-projects-carousel.component';
import { SmallProductItemComponent } from './small-product-item/small-product-item.component';
import { SimilarProductsCarouselComponent } from './similar-products-carousel/similar-products-carousel.component';
import { SmallOfficeProjectItemComponent } from './small-office-project-item/small-office-project-item.component';
import { SimilarOfficeProjectsCarouselComponent } from './similar-office-projects-carousel/similar-office-projects-carousel.component';
import { SimilarBlogsCarouselComponent } from './similar-blogs-carousel/similar-blogs-carousel.component';
import { SmallBlogItemComponent } from './small-blog-item/small-blog-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductMoodBoardSearchComponent } from './product-mood-board-search/product-mood-board-search.component';
import { MoodBoardProductItemComponent } from './mood-board-product-item/mood-board-product-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MoodBoardCategoriesQuickAccessComponent } from './mood-board-categories-quick-access/mood-board-categories-quick-access.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from "ngx-color-picker";
import { MoodBoardItemComponent } from './mood-board-item/mood-board-item.component';
import { MoodBoardsSearchComponent } from './mood-boards-search/mood-boards-search.component';
import { BlogsSearchResultsFiltersComponent } from './blogs-search-results-filters/blogs-search-results-filters.component';
import { MoodBoardCandidateProductOverviewComponent } from './mood-board-candidate-product-overview/mood-board-candidate-product-overview.component';
import { RelatedOfficeProjectsCarouselComponent } from './related-office-projects-carousel/related-office-projects-carousel.component';
import { HeaderLessTabsDirective } from '../theme/directives/headerless-tabs.directive';
import { MoodBoardCandidateProductItemComponent } from './mood-board-candidate-product-item/mood-board-candidate-product-item.component';
import { EventsSearchComponent } from './events-search/events-search.component';
import { EventsSearchResultsFiltersComponent } from './events-search-results-filters/events-search-results-filters.component';
import { EventItemComponent } from './event-item/event-item.component';
import { EventsComponent } from '../pages/events/events.component';
import { EventCategoriesComponent } from './event-categories/event-categories.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { LightboxModule } from 'ngx-lightbox';
import { EventTimelineComponent } from './event-timeline/event-timeline.component';
import { EventTimelineAdvancedComponent } from './event-timeline-advanced/event-timeline-advanced.component';
import { EventTimelineGridComponent } from './event-timeline-grid/event-timeline-grid.component';
import { GridsterModule } from 'angular-gridster2';
import { EventTimelineVerticalComponent } from './event-timeline-vertical/event-timeline-vertical.component';
import { SearchDialogComponent } from '../theme/components/toolbar1/search-dialog/search-dialog.component';
import { EventDetailTimelineGridComponent } from './event-detail-timeline-grid/event-detail-timeline-grid.component';
import { LocationComponent } from './location/location.component';
import { EventDetailTimelineBoxComponent } from './event-detail-timeline-box/event-detail-timeline-box.component';
import { BlogItemHomeComponent } from './blog-item-home/blog-item-home.component';
import { PaginationComponent } from './pagination/pagination.component';
// import { MoodBoardToolboxComponent } from '../pages/design-mood-board/mood-board-toolbox/mood-board-toolbox.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DragDropModule,
    SwiperModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatStepperModule,
    PerfectScrollbarModule,
    PipesModule,
    DirectivesModule,
    FontAwesomeModule,
    InputFileModule,
    ColorPickerModule,
    SlickCarouselModule,
    NgxMasonryModule,
    LightboxModule,
    GridsterModule
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    DragDropModule,
    SwiperModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatStepperModule,
    PerfectScrollbarModule,
    PipesModule,
    DirectivesModule,
    FontAwesomeModule,
    InputFileModule,
    ColorPickerModule,
    SlickCarouselModule,
    NgxMasonryModule,
    LightboxModule,
    GridsterModule,
    LogoComponent,
    HeaderImageComponent,
    HeaderCarouselComponent,
    BrandItemComponent,
    CategoriesComponent,
    BlogItemComponent,
    BlogItemHomeComponent,
    PropertyItemComponent,
    ProductItemComponent,
    ProjectItemComponent,
    LoadMoreComponent,
    PropertiesToolbarComponent,
    BrandsSearchComponent,
    DesignOfficesSearchComponent,
    BlogsSearchComponent,
    PropertiesSearchComponent,
    ProjectsSearchComponent,
    OfficeProjectsSearchComponent,
    EventsSearchComponent,
    CompareOverviewComponent,
    MoodBoardCandidateProductOverviewComponent,
    RatingComponent,
    BlogsSearchResultsFiltersComponent,
    BrandsSearchResultsFiltersComponent,
    DesignOfficesSearchResultsFiltersComponent,
    PropertiesSearchResultsFiltersComponent,
    ProjectsSearchResultsFiltersComponent,
    OfficeProjectsSearchResultsFiltersComponent,
    EventsSearchResultsFiltersComponent,
    PropertiesCarouselComponent,
    ProductsCarouselComponent,
    ProjectsCarouselComponent,
    BrandsCarouselComponent,
    ProductFilesComponent,
    CategoriesQuickAccessComponent,
    MoodBoardCategoriesQuickAccessComponent,
    GetInTouchComponent,
    CommentsComponent,
    TestimonialsComponent,
    OurAgentsComponent,
    MissionComponent,
    OurServicesComponent,
    FileValueAccessorDirective,
    FileValidatorDirective,
    OfficeProjectsComponent,
    OfficeProjectItemComponent,
    EventItemComponent,
    DesignOfficeItemComponent,
    OfficeProjectCategoriesComponent,
    ReadMoreComponent,
    SmallProductItemComponent,
    SimilarProductsCarouselComponent,
    SmallOfficeProjectItemComponent,
    SimilarOfficeProjectsCarouselComponent,
    RelatedOfficeProjectsCarouselComponent,
    SmallBlogItemComponent,
    SimilarBlogsCarouselComponent,
    ProductMoodBoardSearchComponent,
    MoodBoardProductItemComponent,
    MoodBoardCandidateProductItemComponent,
    MoodBoardItemComponent,
    MoodBoardsSearchComponent,
    MoodBoardsSearchResultsFiltersComponent,
    HeaderLessTabsDirective,
    EventTimelineComponent,
    EventTimelineAdvancedComponent,
    EventTimelineGridComponent,
    EventDetailTimelineGridComponent,
    EventTimelineVerticalComponent,
    SearchDialogComponent,
    LocationComponent,
    EventDetailTimelineBoxComponent,
    PaginationComponent
    // MoodBoardToolboxComponent
  ],
  declarations: [
    CategoriesComponent,
    LogoComponent,
    HeaderImageComponent,
    HeaderCarouselComponent,
    BlogItemComponent,
    BlogItemHomeComponent,
    MoodBoardItemComponent,
    PropertyItemComponent,
    BrandItemComponent,
    ProductItemComponent,
    ProjectItemComponent,
    OfficeProjectItemComponent,
    EventItemComponent,
    LoadMoreComponent,
    PropertiesToolbarComponent,
    BrandsSearchComponent,
    BlogsSearchComponent,
    PropertiesSearchComponent,
    ProjectsSearchComponent,
    DesignOfficesSearchComponent,
    OfficeProjectsSearchComponent,
    EventsSearchComponent,
    DesignOfficesSearchResultsFiltersComponent,
    OfficeProjectsSearchResultsFiltersComponent,
    EventsSearchResultsFiltersComponent,
    CompareOverviewComponent,
    MoodBoardCandidateProductOverviewComponent,
    RatingComponent,
    BlogsSearchResultsFiltersComponent,
    BrandsSearchResultsFiltersComponent,
    PropertiesSearchResultsFiltersComponent,
    ProjectsSearchResultsFiltersComponent,
    PropertiesCarouselComponent,
    ProductsCarouselComponent,
    ProjectsCarouselComponent,
    BrandsCarouselComponent,
    ProductFilesComponent,
    OfficeProjectsComponent,
    EventsComponent,
    CategoriesQuickAccessComponent,
    MoodBoardCategoriesQuickAccessComponent,
    GetInTouchComponent,
    CommentsComponent,
    TestimonialsComponent,
    OurAgentsComponent,
    MissionComponent,
    OurServicesComponent,
    FileValueAccessorDirective,
    HeaderLessTabsDirective,
    FileValidatorDirective,
    DesignOfficeItemComponent,
    OfficeProjectCategoriesComponent,
    EventCategoriesComponent,
    ReadMoreComponent,
    SmallProductItemComponent,
    SimilarProductsCarouselComponent,
    SmallOfficeProjectItemComponent,
    SimilarOfficeProjectsCarouselComponent,
    RelatedOfficeProjectsCarouselComponent,
    SmallBlogItemComponent,
    SimilarBlogsCarouselComponent,
    ProductMoodBoardSearchComponent,
    MoodBoardProductItemComponent,
    MoodBoardCandidateProductItemComponent,
    MoodBoardsSearchComponent,
    MoodBoardsSearchResultsFiltersComponent,
    EventTimelineComponent,
    EventTimelineAdvancedComponent,
    EventTimelineGridComponent,
    EventDetailTimelineGridComponent,
    EventTimelineVerticalComponent,
    SearchDialogComponent,
    LocationComponent,
    EventDetailTimelineBoxComponent,
    PaginationComponent
    // MoodBoardToolboxComponent
  ],
  entryComponents: [
    CompareOverviewComponent,
    MoodBoardCandidateProductOverviewComponent
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorInt }
  ]
})
export class SharedModule { }
