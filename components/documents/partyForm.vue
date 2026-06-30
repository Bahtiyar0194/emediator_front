<template>
  <div
    class="card duration-200"
    :class="{
      removing: removeItemIndex === props.partyIndex,
      'scale-95 !bg-yellow-100': highlight,
    }"
  >
    <div class="bg-inactive p-5 border-b-inactive">
      <div class="flex flex-wrap gap-4 justify-between">
        <h3 class="mb-0">
          {{ $t("pages.documents.party") }} {{ props.partyIndex + 1 }}
        </h3>

        <button
          v-if="props.partyIndex > 1"
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="deleteParty(props.partyIndex)"
        >
          <i class="pi pi-trash"></i>
          {{ $t("delete") }}
        </button>
      </div>
    </div>

    <div class="p-5">
      <div class="custom-grid">
        <stepName :num="1" :title="$t('subject_type')" />

        <div class="col-span-12">
          <div class="btn-wrap">
            <label
              v-for="(type, typeIndex) in subjectTypes"
              :key="typeIndex"
              class="custom-radio-button success"
            >
              <input
                type="radio"
                v-model="
                  docData.agreement_parties[props.partyIndex].data.is_legal
                "
                :value="type.legal"
              />
              <span><i class="pi pi-check"></i> {{ $t(type.title) }}</span>
            </label>
          </div>
        </div>

        <stepName :num="2" :title="$t('personal_data')" />

        <div class="col-span-12">
          <div class="custom-grid">
            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-user"></i>
                <input
                  v-model="docData.agreement_parties[props.partyIndex].iin"
                  v-mask="'############'"
                  @change="
                    props.getUserById(
                      props.partyIndex,
                      $event.target.value,
                      false,
                    )
                  "
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.iin`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.iin`]
                      ? $t("form.iin.required")
                      : $t("form.iin.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-user"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].last_name
                  "
                  type="text"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.last_name`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.last_name`]
                      ? $t("form.last_name.required")
                      : $t("form.last_name.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-user"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].first_name
                  "
                  type="text"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.first_name`
                      ],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.first_name`]
                      ? $t("form.name.required")
                      : $t("form.name.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-user"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].given_name
                  "
                  type="text"
                  placeholder=" "
                />
                <label>
                  {{ $t("form.given_name.title") }}
                </label>
              </div>
            </div>

            <div
              v-for="(level, locationIndex) in locationSelections"
              :key="locationIndex"
              class="col-span-12"
              :class="getSelectionColumnClass(locationSelections.length)"
            >
              <div class="form-group-border select active label-active">
                <i class="pi pi-map-marker"></i>

                <select
                  v-model="level.selectedId"
                  @change="onSelectLocation(locationIndex)"
                >
                  <option disabled value="">
                    {{ $t("form.select_a_point") }}
                  </option>

                  <option
                    v-for="option in level.options"
                    :key="option.location_id"
                    :value="option.location_id"
                  >
                    {{ option.location_name }}
                  </option>
                </select>

                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.location.id`
                      ] && locationIndex === locationSelections.length - 1,
                  }"
                >
                  {{ $t("form.select_a_point") }}
                </label>
              </div>
            </div>

            <div class="col-span-12">
              <div class="custom-grid">
                <div
                  v-if="
                    docData.agreement_parties[props.partyIndex].data.location
                      .is_district === true
                  "
                  class="col-span-12 lg:col-span-3"
                >
                  <div class="form-group-border active">
                    <i class="pi pi-map-marker"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .location.village
                      "
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.location.village`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.location.village`
                        ]
                          ? $t("form.village.required")
                          : $t("form.village.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-3">
                  <div class="form-group-border active">
                    <i class="bi bi-signpost-split"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .location.street
                      "
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.location.street`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.location.street`
                        ]
                          ? $t("form.street.required")
                          : $t("form.street.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-3">
                  <div class="form-group-border active">
                    <i class="pi pi-home"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .location.house
                      "
                      type="text"
                      inputmode="numeric"
                      pattern="^\d+(\/\d+)?$"
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.location.house`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.location.house`
                        ]
                          ? $t("form.house.required")
                          : $t("form.house.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-3">
                  <div class="form-group-border active">
                    <i class="bi bi-door-open"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .location.flat
                      "
                      type="number"
                      placeholder=" "
                    />
                    <label>
                      {{ $t("form.flat") }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-3">
                  <div class="form-group-border active">
                    <i class="pi pi-mobile"></i>
                    <input
                      autoComplete="register-phone"
                      v-model="
                        docData.agreement_parties[props.partyIndex].data.phone
                      "
                      v-mask="'+7 (###) ###-####'"
                      placeholder="+7 (___) ___-____"
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.phone`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.phone`
                        ]
                          ? $t("form.phone.required")
                          : $t("form.phone.title")
                      }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            docData.agreement_parties[props.partyIndex].data.is_legal === true
          "
          class="col-span-12"
        >
          <div class="custom-grid">
            <stepName :num="3" :title="$t('legal_entity_data')" />

            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-id-card"></i>
                <input
                  v-model="docData.agreement_parties[props.partyIndex].data.bin"
                  v-mask="'############'"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.data.bin`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.data.bin`]
                      ? $t("form.bin.required")
                      : $t("form.bin.title")
                  }}
                </label>
              </div>
            </div>

            <div v-if="legalForms.length > 0" class="col-span-12 lg:col-span-3">
              <div class="form-group-border select active label-active">
                <i class="pi pi-id-card"></i>
                <select
                  v-model.number="
                    docData.agreement_parties[props.partyIndex].data
                      .legal_form_id
                  "
                >
                  <option disabled :value="null">
                    {{ $t("form.select_legal_form") }}
                  </option>
                  <option
                    v-for="option in legalForms"
                    :key="option.legal_form_id"
                    :value="option.legal_form_id"
                  >
                    {{ option.legal_form_name }}
                  </option>
                </select>
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.legal_form_id`
                      ],
                  }"
                >
                  {{
                    errors[
                      `agreement_parties.${props.partyIndex}.data.legal_form_id`
                    ]
                      ? $t("form.select_legal_form")
                      : $t("form.legal_form")
                  }}
                </label>
              </div>
            </div>

            <div v-if="posts.length > 0" class="col-span-12 lg:col-span-3">
              <div class="form-group-border select active label-active">
                <i class="pi pi-id-card"></i>
                <select
                  v-model.number="
                    docData.agreement_parties[props.partyIndex].data
                      .post_type_id
                  "
                >
                  <option disabled :value="null">
                    {{ $t("form.select_post") }}
                  </option>
                  <option
                    v-for="option in posts"
                    :key="option.post_type_id"
                    :value="option.post_type_id"
                  >
                    {{ option.post_type_name }}
                  </option>
                </select>
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.post_type_id`
                      ],
                  }"
                >
                  {{
                    errors[
                      `agreement_parties.${props.partyIndex}.data.post_type_id`
                    ]
                      ? $t("form.select_post")
                      : $t("form.post")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-3">
              <div class="form-group-border active">
                <i class="pi pi-file"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].data
                      .company_name
                  "
                  type="text"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.company_name`
                      ],
                  }"
                >
                  {{
                    errors[
                      `agreement_parties.${props.partyIndex}.data.company_name`
                    ]
                      ? $t("form.company_name.required")
                      : $t("form.company_name.title")
                  }}
                </label>
              </div>
            </div>

            <div
              v-for="(level, companyLocationIndex) in companyLocationSelections"
              :key="companyLocationIndex"
              class="col-span-12"
              :class="getSelectionColumnClass(companyLocationSelections.length)"
            >
              <div class="form-group-border select active label-active">
                <i class="pi pi-map-marker"></i>
                <select
                  v-model="level.selectedId"
                  @change="onSelectCompanyLocation(companyLocationIndex)"
                >
                  <option disabled value="">
                    {{ $t("form.select_a_point") }}
                  </option>
                  <option
                    v-for="option in level.options"
                    :key="option.location_id"
                    :value="option.location_id"
                  >
                    {{ option.location_name }}
                  </option>
                </select>
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.company_location.id`
                      ] &&
                      companyLocationIndex ===
                        companyLocationSelections.length - 1,
                  }"
                >
                  {{ $t("form.select_a_point") }}
                </label>
              </div>
            </div>

            <div class="col-span-12">
              <div class="custom-grid">
                <div
                  v-if="
                    docData.agreement_parties[props.partyIndex].data
                      .company_location.is_district === true
                  "
                  class="col-span-12 lg:col-span-4"
                >
                  <div class="form-group-border active">
                    <i class="pi pi-map-marker"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .company_location.village
                      "
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.company_location.village`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.company_location.village`
                        ]
                          ? $t("form.village.required")
                          : $t("form.village.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-4">
                  <div class="form-group-border active">
                    <i class="bi bi-signpost-split"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .company_location.street
                      "
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.company_location.street`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.company_location.street`
                        ]
                          ? $t("form.street.required")
                          : $t("form.street.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-4">
                  <div class="form-group-border active">
                    <i class="pi pi-building"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .company_location.building
                      "
                      inputmode="numeric"
                      pattern="^\d+(\/\d+)?$"
                      placeholder=" "
                    />
                    <label
                      :class="{
                        'label-error':
                          errors[
                            `agreement_parties.${props.partyIndex}.data.company_location.building`
                          ],
                      }"
                    >
                      {{
                        errors[
                          `agreement_parties.${props.partyIndex}.data.company_location.building`
                        ]
                          ? $t("form.building.required")
                          : $t("form.building.title")
                      }}
                    </label>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-4">
                  <div class="form-group-border active">
                    <i class="bi bi-door-open"></i>
                    <input
                      v-model="
                        docData.agreement_parties[props.partyIndex].data
                          .company_location.cabinet
                      "
                      type="number"
                      placeholder=" "
                    />
                    <label>
                      {{ $t("form.cabinet") }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!--Имеется доверенное лицо-->
            <div class="col-span-12">
              <label class="custom-checkbox my-2">
                <input
                  type="checkbox"
                  v-model="
                    docData.agreement_parties[props.partyIndex].data.attorney
                      .includes
                  "
                />
                <span>{{ $t("form.attorney.is_available") }}</span>
              </label>
            </div>

            <div
              v-if="
                docData.agreement_parties[props.partyIndex].data.attorney
                  .includes === true
              "
              class="col-span-12"
            >
              <div class="custom-grid">
                <stepName :num="4" :title="$t('form.attorney.title')" />

                <div class="col-span-12">
                  <div class="custom-grid">
                    <div class="col-span-12 lg:col-span-3">
                      <div class="form-group-border active">
                        <i class="pi pi-user"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.person.iin
                          "
                          v-mask="'############'"
                          @change="
                            props.getUserById(
                              props.partyIndex,
                              $event.target.value,
                              true,
                            )
                          "
                          placeholder=" "
                        />
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.person.iin`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.person.iin`
                            ]
                              ? $t("form.iin.required")
                              : $t("form.iin.title")
                          }}
                        </label>
                      </div>
                    </div>

                    <div class="col-span-12 lg:col-span-3">
                      <div class="form-group-border active">
                        <i class="pi pi-user"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.person.last_name
                          "
                          type="text"
                          placeholder=" "
                        />
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.person.last_name`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.person.last_name`
                            ]
                              ? $t("form.last_name.required")
                              : $t("form.last_name.title")
                          }}
                        </label>
                      </div>
                    </div>

                    <div class="col-span-12 lg:col-span-3">
                      <div class="form-group-border active">
                        <i class="pi pi-user"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.person.first_name
                          "
                          type="text"
                          placeholder=" "
                        />
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.person.first_name`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.person.first_name`
                            ]
                              ? $t("form.name.required")
                              : $t("form.name.title")
                          }}
                        </label>
                      </div>
                    </div>

                    <div class="col-span-12 lg:col-span-3">
                      <div class="form-group-border active">
                        <i class="pi pi-user"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.person.given_name
                          "
                          type="text"
                          placeholder=" "
                        />
                        <label>
                          {{ $t("form.given_name.title") }}
                        </label>
                      </div>
                    </div>

                    <div
                      v-for="(level, attorneyLocationIndex) in attorneyLocationSelections"
                      :key="attorneyLocationIndex"
                      class="col-span-12"
                      :class="
                        getSelectionColumnClass(
                          attorneyLocationSelections.length,
                        )
                      "
                    >
                      <div class="form-group-border select active label-active">
                        <i class="pi pi-map-marker"></i>

                        <select
                          v-model="level.selectedId"
                          @change="onSelectAttorneyLocation(attorneyLocationIndex)"
                        >
                          <option disabled value="">
                            {{ $t("form.select_a_point") }}
                          </option>

                          <option
                            v-for="option in level.options"
                            :key="option.location_id"
                            :value="option.location_id"
                          >
                            {{ option.location_name }}
                          </option>
                        </select>

                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.id`
                              ] &&
                              attorneyLocationIndex === attorneyLocationSelections.length - 1,
                          }"
                        >
                          {{ $t("form.select_a_point") }}
                        </label>
                      </div>
                    </div>

                    <div class="col-span-12">
                      <div class="custom-grid">
                        <div
                          v-if="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.person.data.location.is_district ===
                            true
                          "
                          class="col-span-12 lg:col-span-3"
                        >
                          <div class="form-group-border active">
                            <i class="pi pi-map-marker"></i>
                            <input
                              v-model="
                                docData.agreement_parties[props.partyIndex].data
                                  .attorney.person.data.location.village
                              "
                              placeholder=" "
                            />
                            <label
                              :class="{
                                'label-error':
                                  errors[
                                    `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.village`
                                  ],
                              }"
                            >
                              {{
                                errors[
                                  `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.village`
                                ]
                                  ? $t("form.village.required")
                                  : $t("form.village.title")
                              }}
                            </label>
                          </div>
                        </div>

                        <div class="col-span-12 lg:col-span-3">
                          <div class="form-group-border active">
                            <i class="bi bi-signpost-split"></i>
                            <input
                              v-model="
                                docData.agreement_parties[props.partyIndex].data
                                  .attorney.person.data.location.street
                              "
                              placeholder=" "
                            />
                            <label
                              :class="{
                                'label-error':
                                  errors[
                                    `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.street`
                                  ],
                              }"
                            >
                              {{
                                errors[
                                  `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.street`
                                ]
                                  ? $t("form.street.required")
                                  : $t("form.street.title")
                              }}
                            </label>
                          </div>
                        </div>

                        <div class="col-span-12 lg:col-span-3">
                          <div class="form-group-border active">
                            <i class="pi pi-home"></i>
                            <input
                              v-model="
                                docData.agreement_parties[props.partyIndex].data
                                  .attorney.person.data.location.house
                              "
                              type="text"
                              inputmode="numeric"
                              pattern="^\d+(\/\d+)?$"
                              placeholder=" "
                            />
                            <label
                              :class="{
                                'label-error':
                                  errors[
                                    `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.house`
                                  ],
                              }"
                            >
                              {{
                                errors[
                                  `agreement_parties.${props.partyIndex}.data.attorney.person.data.location.house`
                                ]
                                  ? $t("form.house.required")
                                  : $t("form.house.title")
                              }}
                            </label>
                          </div>
                        </div>

                        <div class="col-span-12 lg:col-span-3">
                          <div class="form-group-border active">
                            <i class="bi bi-door-open"></i>
                            <input
                              v-model="
                                docData.agreement_parties[props.partyIndex].data
                                  .attorney.person.data.location.flat
                              "
                              type="number"
                              placeholder=" "
                            />
                            <label>
                              {{ $t("form.flat") }}
                            </label>
                          </div>
                        </div>

                        <div class="col-span-12 lg:col-span-3">
                          <div class="form-group-border active">
                            <i class="pi pi-mobile"></i>
                            <input
                              autoComplete="register-phone"
                              v-model="
                                docData.agreement_parties[props.partyIndex].data
                                  .attorney.person.data.phone
                              "
                              v-mask="'+7 (###) ###-####'"
                              placeholder="+7 (___) ___-____"
                            />
                            <label
                              :class="{
                                'label-error':
                                  errors[
                                    `agreement_parties.${props.partyIndex}.data.attorney.person.data.phone`
                                  ],
                              }"
                            >
                              {{
                                errors[
                                  `agreement_parties.${props.partyIndex}.data.attorney.person.data.phone`
                                ]
                                  ? $t("form.phone.required")
                                  : $t("form.phone.title")
                              }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="attorneyTypes.length > 0"
                      class="col-span-12 lg:col-span-4"
                    >
                      <div class="form-group-border select active label-active">
                        <i class="pi pi-id-card"></i>
                        <select
                          v-model.number="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.type_id
                          "
                        >
                          <option disabled :value="null">
                            {{ $t("form.attorney.type.required") }}
                          </option>
                          <option
                            v-for="option in attorneyTypes"
                            :key="option.attorney_type_id"
                            :value="option.attorney_type_id"
                          >
                            {{ option.attorney_type_name }}
                          </option>
                        </select>
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.type_id`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.type_id`
                            ]
                              ? $t("form.attorney.type.required")
                              : $t("form.attorney.type.title")
                          }}
                        </label>
                      </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                      <div class="form-group-border active">
                        <i class="pi pi-file"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.num
                          "
                          inputmode="numeric"
                          pattern="^\d+(\/\d+)?$"
                          placeholder=" "
                        />
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.num`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.num`
                            ]
                              ? $t("form.attorney.num.required")
                              : $t("form.attorney.num.title")
                          }}
                        </label>
                      </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4">
                      <div class="form-group-border active">
                        <i class="pi pi-calendar"></i>
                        <input
                          v-model="
                            docData.agreement_parties[props.partyIndex].data
                              .attorney.date
                          "
                          type="date"
                          placeholder=" "
                        />
                        <label
                          :class="{
                            'label-error':
                              errors[
                                `agreement_parties.${props.partyIndex}.data.attorney.date`
                              ],
                          }"
                        >
                          {{
                            errors[
                              `agreement_parties.${props.partyIndex}.data.attorney.date`
                            ]
                              ? $t("form.attorney.date.required")
                              : $t("form.attorney.date.title")
                          }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useLocationSelect } from "../../composables/useLocationSelect";
import stepName from "../ui/stepName.vue";

const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },
  locations: {
    type: Object,
    required: true,
  },
  legalForms: {
    type: Object,
    required: true,
  },
  posts: {
    type: Object,
    required: true,
  },
  attorneyTypes: {
    type: Object,
    required: true,
  },
  subjectTypes: {
    type: Object,
    required: true,
  },

  partyIndex: {
    type: Number,
    required: true,
  },

  docData: {
    type: Object,
    required: true,
  },

  getUserById: {
    type: Function,
    required: true,
  },
});

const highlight = ref(true);
const removeItemIndex = ref(null);

const {
  errors,
  locations,
  legalForms,
  posts,
  attorneyTypes,
  subjectTypes,
  docData,
} = toRefs(props);

const deleteParty = (index) => {
  const parties = docData.value.agreement_parties;

  // Минимум 2 участника
  if (parties.length <= 2) return;

  // Проверка индекса
  if (!Number.isInteger(index) || index < 0 || index >= parties.length) {
    return;
  }

  removeItemIndex.value = index;

  setTimeout(() => {
    parties.splice(index, 1);
  }, 500); // время должно совпадать с CSS-анимацией
};

const getSelectionColumnClass = (selectionCount) => {
  if (selectionCount <= 1) {
    return "lg:col-span-12";
  }

  if (selectionCount === 2) {
    return "lg:col-span-6";
  }

  if (selectionCount === 3) {
    return "lg:col-span-4";
  }

  return "lg:col-span-3";
};

const locationModel = computed({
  get: () => docData.value.agreement_parties[props.partyIndex].data.location,
  set: (val) => {
    docData.value.agreement_parties[props.partyIndex].data.location = val;
  },
});

const companyLocationModel = computed({
  get: () =>
    docData.value.agreement_parties[props.partyIndex].data.company_location,
  set: (val) => {
    docData.value.agreement_parties[props.partyIndex].data.company_location =
      val;
  },
});

const attorneyLocationModel = computed({
  get: () =>
    docData.value.agreement_parties[props.partyIndex].data.attorney.person.data
      .location,
  set: (val) => {
    docData.value.agreement_parties[
      props.partyIndex
    ].data.attorney.person.data.location = val;
  },
});

const {
  selections: locationSelections,
  init: initLocation,
  onSelect: onSelectLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: locationModel,
});

const {
  selections: companyLocationSelections,
  init: initCompanyLocation,
  onSelect: onSelectCompanyLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: companyLocationModel,
});

const {
  selections: attorneyLocationSelections,
  init: initAttorneyLocation,
  onSelect: onSelectAttorneyLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: attorneyLocationModel,
});

watch(
  () => locations.value,
  () => {
    initLocation();
    initCompanyLocation();
    initAttorneyLocation();
  },
  { immediate: true },
);

onMounted(() => {
  setTimeout(() => {
    highlight.value = false;
  }, 100);
});
</script>
