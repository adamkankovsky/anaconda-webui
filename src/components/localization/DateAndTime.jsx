/*
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with This program; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from "cockpit";

import React, { useState } from "react";
import {
    Checkbox, Flex, FlexItem,
    Form,
    FormGroup,
    MenuToggle,
    Radio,
    Select,
    SelectList,
    SelectOption,
    Stack,
    StackItem,
    TextInput,
    Title
} from "@patternfly/react-core";

const ntpServers = [
    "ntp.fedoraproject.org",
    "pool.ntp.org",
    "time.cloudflare.com",
    "custom..."
];

const regions = ["Europe", "America", "Asia"];

const citiesByRegion = {
    Europe: ["Berlin", "Prague", "Paris"],
    America: ["New York", "Chicago", "Los Angeles"],
    Asia: ["Tokyo", "Shanghai", "Delhi"]
};

const timezoneLabels = {
    "Europe/Berlin": "CEST, UTC+2",
    "Europe/Prague": "CEST, UTC+2",
    "Europe/Paris": "CEST, UTC+2",
    "America/New York": "EDT, UTC-4",
    "America/Chicago": "CDT, UTC-5",
    "America/Los Angeles": "PDT, UTC-7",
    "Asia/Tokyo": "JST, UTC+9",
    "Asia/Shanghai": "CST, UTC+8",
    "Asia/Delhi": "IST, UTC+5:30"
};

const _ = cockpit.gettext;

const DateAndTimeSection = () => {
    const [autoDateTime, setAutoDateTime] = useState(true);
    const [ntpSelectOpen, setNtpSelectOpen] = useState(false);
    const [ntpServer, setNtpServer] = useState(ntpServers[0]);
    const [date, setDate] = useState("2025-05-19");
    const [time, setTime] = useState("12:55");

    const ntpToggle = toggleRef => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setNtpSelectOpen(!ntpSelectOpen)}
          isExpanded={ntpSelectOpen}
          isDisabled={!autoDateTime}
        >
            {ntpServer}
        </MenuToggle>
    );

    return (
        <>
            <Title headingLevel="h2">{_("Date and time")}</Title>
            <FormGroup>
                <Stack hasGutter>
                    <StackItem>
                        <Flex alignItems={{ default: "alignItemsCenter" }}>
                            <FlexItem>
                                <Checkbox
                                  id="auto-date-time"
                                  isChecked={autoDateTime}
                                  onChange={() => setAutoDateTime(!autoDateTime)}
                                  label={_("Automatically set date and time, using time server:")}
                                  aria-label={_("Automatically set date and time")}
                                />
                            </FlexItem>
                            <FlexItem>
                                <Select
                                  id="ntp-server"
                                  isOpen={ntpSelectOpen}
                                  selected={ntpServer}
                                  onSelect={(_ev, value) => {
                                      setNtpServer(value);
                                      setNtpSelectOpen(false);
                                  }}
                                  onOpenChange={setNtpSelectOpen}
                                  toggle={ntpToggle}
                                  shouldFocusToggleOnSelect
                                  aria-label={_("Select NTP server")}
                                >
                                    <SelectList>
                                        {ntpServers.map(server =>
                                            <SelectOption key={server} value={server}>{server}</SelectOption>
                                        )}
                                    </SelectList>
                                </Select>
                            </FlexItem>
                        </Flex>
                    </StackItem>
                    <StackItem>
                        <Flex alignItems={{ default: "alignItemsCenter" }} style={{ marginLeft: 32 }}>
                            <FlexItem>
                                <TextInput
                                  id="date"
                                  type="date"
                                  value={date}
                                  onChange={setDate}
                                  isDisabled={autoDateTime}
                                  aria-label={_("Date")}
                                />
                            </FlexItem>
                            <FlexItem>
                                <TextInput
                                  id="time"
                                  type="time"
                                  value={time}
                                  onChange={setTime}
                                  isDisabled={autoDateTime}
                                  aria-label={_("Time")}
                                />
                            </FlexItem>
                        </Flex>
                    </StackItem>
                </Stack>
            </FormGroup>
        </>
    );
};

const TimezoneSection = () => {
    const [autoTimezone, setAutoTimezone] = useState(true);
    const [regionSelectOpen, setRegionSelectOpen] = useState(false);
    const [citySelectOpen, setCitySelectOpen] = useState(false);
    const [region, setRegion] = useState(regions[0]);
    const [city, setCity] = useState(citiesByRegion[regions[0]][0]);

    const timezoneKey = `${region}/${city}`;
    const timezoneLabel = timezoneLabels[timezoneKey] || "";

    const regionToggle = toggleRef => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setRegionSelectOpen(!regionSelectOpen)}
          isExpanded={regionSelectOpen}
          isDisabled={autoTimezone}
          style={{ minWidth: 120 }}
        >
            {region}
        </MenuToggle>
    );
    const cityToggle = toggleRef => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setCitySelectOpen(!citySelectOpen)}
          isExpanded={citySelectOpen}
          isDisabled={autoTimezone}
          style={{ minWidth: 140 }}
        >
            {city}
        </MenuToggle>
    );

    return (
        <>
            <Title headingLevel="h2">{_("Timezone")}</Title>
            <FormGroup>
                <Stack hasGutter>
                    <StackItem>
                        <Flex alignItems={{ default: "alignItemsCenter" }}>
                            <FlexItem>
                                <Checkbox
                                  id="auto-timezone"
                                  isChecked={autoTimezone}
                                  onChange={() => setAutoTimezone(!autoTimezone)}
                                  label={_("Automatically set timezone")}
                                  aria-label={_("Automatically set timezone")}
                                />
                            </FlexItem>
                        </Flex>
                    </StackItem>
                    <StackItem>
                        <Flex alignItems={{ default: "alignItemsCenter" }} style={{ marginLeft: 32 }}>
                            <FlexItem>
                                <Select
                                  id="region"
                                  isOpen={regionSelectOpen}
                                  selected={region}
                                  onSelect={(_ev, value) => {
                                      setRegion(value);
                                      setCity(citiesByRegion[value][0]);
                                      setRegionSelectOpen(false);
                                  }}
                                  onOpenChange={setRegionSelectOpen}
                                  toggle={regionToggle}
                                  shouldFocusToggleOnSelect
                                  isDisabled={autoTimezone}
                                  aria-label={_("Select region")}
                                  style={{ minWidth: 120 }}
                                >
                                    <SelectList>
                                        {regions.map(r =>
                                            <SelectOption key={r} value={r}>{r}</SelectOption>
                                        )}
                                    </SelectList>
                                </Select>
                            </FlexItem>
                            <FlexItem>
                                <Select
                                  id="city"
                                  isOpen={citySelectOpen}
                                  selected={city}
                                  onSelect={(_ev, value) => {
                                      setCity(value);
                                      setCitySelectOpen(false);
                                  }}
                                  onOpenChange={setCitySelectOpen}
                                  toggle={cityToggle}
                                  shouldFocusToggleOnSelect
                                  isDisabled={autoTimezone}
                                  aria-label={_("Select city")}
                                  style={{ minWidth: 140 }}
                                >
                                    <SelectList>
                                        {citiesByRegion[region].map(c =>
                                            <SelectOption key={c} value={c}>{c}</SelectOption>
                                        )}
                                    </SelectList>
                                </Select>
                            </FlexItem>
                            <FlexItem>
                                <span className="pf-v6-u-color-200" style={{ marginLeft: "var(--pf-v6-global--spacer--lg)" }}>
                                    {timezoneLabel}
                                </span>
                            </FlexItem>
                        </Flex>
                    </StackItem>
                </Stack>
            </FormGroup>
        </>
    );
};

const TimeFormatSection = () => {
    const [timeFormat, setTimeFormat] = useState("24");

    return (
        <>
            <Title headingLevel="h2">{_("Time format")}</Title>
            <FormGroup>
                <Flex alignItems={{ default: "alignItemsCenter" }}>
                    <FlexItem>
                        <Radio
                          id="time-format-24"
                          name="timeFormat"
                          label={_("24 hour")}
                          isChecked={timeFormat === "24"}
                          onChange={() => setTimeFormat("24")}
                        />
                    </FlexItem>
                    <FlexItem>
                        <Radio
                          id="time-format-ampm"
                          name="timeFormat"
                          label={_("AM / PM")}
                          isChecked={timeFormat === "ampm"}
                          onChange={() => setTimeFormat("ampm")}
                        />
                    </FlexItem>
                </Flex>
            </FormGroup>
        </>
    );
};

const DateAndTimePage = ({ setIsFormValid }) => (
    <Form>
        <DateAndTimeSection />
        <TimezoneSection />
        <TimeFormatSection />
    </Form>
);

export class Page {
    constructor () {
        this.component = DateAndTimePage;
        this.id = "anaconda-screen-date-time";
        this.label = _("Date and time");
    }
}
