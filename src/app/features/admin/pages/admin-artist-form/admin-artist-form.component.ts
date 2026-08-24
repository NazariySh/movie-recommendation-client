import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../../artists/services/artist.service';
import { AdminArtistsService } from '../../services/admin-artists.service';
import { FormComponent } from '../../../../shared/form/form-component';
import { AdminArtistFormDto } from '../../models/admin-models';
import { AdminRoutes, AppPaths } from '../../../../core/constants/app-routes';
import { SelectItem } from '../../../../core/models/select-item';

@Component({
  selector: 'app-admin-artist-form',
  templateUrl: './admin-artist-form.component.html',
  styleUrl: './admin-artist-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminArtistFormComponent extends FormComponent implements OnInit {
  public form!: FormGroup;
  public artistId: string | null = null;
  public loading = false;
  public saving = false;
  public photoFile: File | null = null;

  public readonly AppPaths = AppPaths;
  public readonly AdminRoutes = AdminRoutes;

  public readonly genderOptions: SelectItem[] = [
    { value: '', label: '—' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  public constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly artistsApi: ArtistService,
    private readonly api: AdminArtistsService,
    private readonly destroyRef: DestroyRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.artistId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      name: ['', Validators.required],
      imdbId: [''],
      tmdbId: [null],
      photoUrl: [''],
      birthday: [null],
      dateOfDeath: [null],
      placeOfBirth: [''],
      nationality: [''],
      gender: [''],
      knownForDepartment: [''],
      biography: [''],
    });

    if (this.artistId) {
      this.loading = true;
      this.cdr.markForCheck();
      this.artistsApi.getArtistById(this.artistId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (detail) => {
            this.form.patchValue({
              name: detail.name,
              imdbId: detail.imdbId,
              tmdbId: detail.tmdbId,
              photoUrl: detail.photoUrl,
              birthday: detail.birthday,
              dateOfDeath: detail.dateOfDeath,
              placeOfBirth: detail.placeOfBirth,
              nationality: detail.nationality,
              gender: detail.gender,
              knownForDepartment: detail.knownForDepartment,
              biography: detail.biography,
            });
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => { this.loading = false; this.cdr.markForCheck(); },
        });
    }
  }

  public submit(): void {
    if (this.saving) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = this.form.value as AdminArtistFormDto;
    this.saving = true;
    this.cdr.markForCheck();

    if (this.artistId) {
      const id = this.artistId;
      this.api.update(id, dto, this.photoFile)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving = false;
            this.cdr.markForCheck();
            this.toast.success('ADMIN.ARTISTS.UPDATED');
            this.router.navigate([AppPaths.ADMIN, AdminRoutes.ARTISTS, id, 'edit']);
          },
          error: (err: HttpErrorResponse) => this.onSubmitError(err),
        });
    } else {
      this.api.create(dto, this.photoFile)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            this.saving = false;
            this.cdr.markForCheck();
            this.toast.success('ADMIN.ARTISTS.CREATED');
            this.router.navigate([AppPaths.ADMIN, AdminRoutes.ARTISTS, result.id, 'edit']);
          },
          error: (err: HttpErrorResponse) => this.onSubmitError(err),
        });
    }
  }

  private onSubmitError(err: HttpErrorResponse): void {
    this.saving = false;
    this.handleValidationError(err);
    this.cdr.markForCheck();
  }

  public cancel(): void {
    this.router.navigate([AppPaths.ADMIN, AdminRoutes.ARTISTS]);
  }
}
