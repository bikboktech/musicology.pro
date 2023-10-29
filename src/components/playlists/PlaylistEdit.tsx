import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Autocomplete,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  useTheme,
  Paper,
  CardHeader,
  Divider,
  List,
  RadioGroup,
  IconButton,
  Tabs,
  Tab,
  Stack,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import CustomRadio from "../../components/forms/theme-elements/CustomRadio";
import * as yup from "yup";
import {
  IconChevronDown,
  IconPhoto,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { IconXboxX, IconCircleCheck } from "@tabler/icons-react";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ErrorSnackbar from "../../components/error/ErrorSnackbar";
import CustomCheckbox from "../../components/forms/theme-elements/CustomCheckbox";
import axios from "axios";
import buildQueryParams, {
  QueryParams,
} from "../../components/smart-table/utils/buildQueryParams";
import { getSpotifyPlaylistId } from "../../utils/spotify";
import { TrackInfo } from "../../types/playlist/TrackInfo";
import { PlaylistInfoData } from "../../types/playlist/PlaylistInfoData";
import { useFormik } from "formik";
import { useRouter } from "next/router";

const TABS = [
  {
    value: "playlistTemplate1",
    label: "Playlist Template 1",
  },
  {
    value: "playlistTemplate2",
    label: "Playlist Template 2",
  },
  {
    value: "playlistTemplate3",
    label: "Playlist Template 3",
  },
  {
    value: "playlistTemplate4",
    label: "Playlist Template 4",
  },
  {
    value: "playlistTemplate5",
    label: "Playlist Template 5",
  },
  {
    value: "playlistTemplate6",
    label: "Playlist Template 6",
  },
  {
    value: "playlistTemplate7",
    label: "Playlist Template 7",
  },
];

type SpotifyPlaylistInfo = {
  id: string;
  name: string;
  tracks: TrackInfo[];
  url: string;
};

const getPlaylist = async (
  setPlaylist: Dispatch<SetStateAction<SpotifyPlaylistInfo | undefined>>,
  playlistLink: string
) => {
  const playlistId = getSpotifyPlaylistId(playlistLink);

  const playlist = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/playlists/${playlistId}`
  );

  setPlaylist(playlist.data);
};

const getTracks = async (
  setTracks: Dispatch<SetStateAction<TrackInfo[]>>,
  params: QueryParams
) => {
  const queryParams = buildQueryParams(params);

  const tracks = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/tracks?${queryParams}`
  );

  setTracks(tracks.data);
};

const getEventTypes = async (
  setEventTypes: Dispatch<
    SetStateAction<{ id: number; name: string }[] | undefined>
  >
) => {
  const eventTypes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/types`
  );

  setEventTypes(eventTypes.data);
};

const getTemplatePlaylists = async (
  setTemplatePlaylists: Dispatch<
    SetStateAction<{ id: number; name: string }[] | undefined>
  >,
  setOpenTab: Dispatch<SetStateAction<number | undefined>>
) => {
  const templatePlaylists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists`
  );

  setTemplatePlaylists(
    templatePlaylists.data.data.map((templatePlaylist: any) => ({
      id: templatePlaylist.id,
      name: templatePlaylist.playlistName,
    }))
  );

  if (templatePlaylists.data.data.length) {
    setOpenTab(templatePlaylists.data.data[0].id);
  }
};

const getTemplatePlaylist = async (
  setPlaylist: Dispatch<SetStateAction<SpotifyPlaylistInfo | undefined>>,
  playlistId: number
) => {
  const playlist = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists/${playlistId}`
  );

  setPlaylist(playlist.data);
};

const compareSelected = (
  item: TrackInfo,
  values: SpotifyPlaylistInfo | PlaylistInfoData | undefined
) => {
  if (!values?.tracks || !values) {
    return false;
  }
  const isAlreadySelected = values.tracks.find((track) => item.id === track.id);

  return Boolean(isAlreadySelected);
};

const PlaylistEdit = ({
  wizardProps,
  values,
  setValues,
  setEdit,
  eventId,
  isTemplatePlaylist,
}: {
  wizardProps?: EventWizardProps;
  values: PlaylistInfoData | undefined;
  setValues: Dispatch<SetStateAction<PlaylistInfoData | undefined>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  eventId?: number | null;
  isTemplatePlaylist?: boolean;
}) => {
  const [tracks, setTracks] = useState<TrackInfo[]>([]);
  const [playlistCreationType, setPlaylistCreationType] =
    useState<string>("spotifySearch");
  const [openTab, setOpenTab] = useState<number>();
  const [playlistChecked, setPlaylistChecked] = useState<string[]>([]);
  const [valueTracksChecked, setValueTracksChecked] = useState<string[]>([]);
  const [playlist, setPlaylist] = useState<SpotifyPlaylistInfo>();
  const [templatePlaylists, setTemplatePlaylists] =
    useState<{ id: number; name: string }[]>();
  const [spotifyLink, setSpotifyLink] = useState<string>("");
  const [eventTypes, setEventTypes] =
    useState<{ id: number; name: string }[]>();
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const borderColor = theme.palette.primary.main;

  useEffect(() => {
    if (!eventTypes && isTemplatePlaylist) {
      getEventTypes(setEventTypes);
    }
  }, [eventTypes]);

  useEffect(() => {
    if (!tracks) {
      getTracks(setTracks, {});
    }
  }, [tracks]);

  useEffect(() => {
    if (!templatePlaylists) {
      getTemplatePlaylists(setTemplatePlaylists, setOpenTab);
    }
  }, [templatePlaylists]);

  useEffect(() => {
    if (
      playlistCreationType === "recommendedPlaylists" &&
      templatePlaylists?.length &&
      openTab
    ) {
      getTemplatePlaylist(setPlaylist, openTab);
    }
  }, [playlistCreationType, openTab]);

  const formik = useFormik({
    initialValues: {
      playlistName: values?.name || "",
      eventType: values?.eventType || {
        id: 0,
        name: "",
      },
    },
    validationSchema: yup.object({
      playlistName: yup.string().required("Playlist name is required"),
      eventType: yup.object({
        id: yup.number(),
        name: isTemplatePlaylist
          ? yup.string().required("Event type is required")
          : yup.string(),
      }),
    }),
    onSubmit: async (formData) => {
      if (!values?.tracks?.length) {
        setError("Playlist is empty");
      } else {
        try {
          if (isTemplatePlaylist) {
            if (values?.id) {
              await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists/${values.id}`,
                JSON.stringify({
                  playlistName: formData.playlistName,
                  eventTypeId: formData.eventType.id,
                  trackIds: values?.tracks?.map((track: TrackInfo) => track.id),
                }),
                {
                  headers: { "Content-Type": "application/json" },
                }
              );

              if (setEdit) {
                setEdit(false);
              }
            } else {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists`,
                JSON.stringify({
                  playlistName: formData.playlistName,
                  eventTypeId: formData.eventType.id,
                  trackIds: values?.tracks?.map((track: TrackInfo) => track.id),
                }),
                {
                  headers: { "Content-Type": "application/json" },
                }
              );

              setValues({
                ...values,
                id: response.data.id,
                name: response.data.playlistName,
              });

              router.push(`/playlists/${response.data.id}`);
            }
          } else {
            if (values?.id) {
              const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${values.id}`,
                JSON.stringify({
                  playlistName: formData.playlistName,
                  trackIds: values?.tracks?.map((track: TrackInfo) => track.id),
                }),
                {
                  headers: { "Content-Type": "application/json" },
                }
              );

              if (setEdit) {
                setEdit(false);
              }

              setValues({
                ...values,
                id: response.data.id,
                name: response.data.playlistName,
              });

              wizardProps?.handleNext();
            } else {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`,
                JSON.stringify({
                  eventId,
                  playlistName: formData.playlistName,
                  trackIds: values?.tracks?.map((track: TrackInfo) => track.id),
                }),
                {
                  headers: { "Content-Type": "application/json" },
                }
              );

              setValues({
                ...values,
                id: response.data.id,
                name: response.data.playlistName,
              });

              wizardProps?.handleNext();
            }
          }
        } catch (err: any) {
          setError(err.response.data);
        }
      }
    },
  });

  useEffect(() => {
    const el = document.querySelector(".Mui-error, [data-error]");
    (el?.parentElement ?? el)?.scrollIntoView();
  }, [formik.isSubmitting]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };

  function not(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(checked: string[], tracks: string[]) {
    return checked.filter((value) => tracks.indexOf(value) !== -1);
  }

  function union(a: string[], b: string[]) {
    return [...a, ...not(b, a)];
  }

  const numberOfChecked = (items: string[], checked: string[]) =>
    intersection(checked, items).length;

  const handleToggleAll =
    (
      items: string[],
      checked: string[],
      setChecked: Dispatch<SetStateAction<string[]>>
    ) =>
    () => {
      if (numberOfChecked(items, checked) === items.length) {
        setChecked(not(checked, items));
      } else {
        setChecked(union(checked, items));
      }
    };

  const handleToggle =
    (
      value: string,
      checked: string[],
      setChecked: Dispatch<SetStateAction<string[]>>
    ) =>
    () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };

  const handleAddToPlaylist = () => {
    const tracks = playlist?.tracks.filter((track) =>
      playlistChecked.includes(track.id)
    ) as TrackInfo[];

    setValues({
      ...values,
      tracks: [...(values?.tracks || []), ...tracks],
    });
  };

  const handleRemoveFromPlaylist = () => {
    const playlistTracks = not(playlistChecked, valueTracksChecked);

    setPlaylistChecked([...playlistTracks]);

    setValues({
      ...values,
      tracks: [
        ...(values?.tracks?.filter(
          (track: TrackInfo) => !valueTracksChecked.includes(track.id)
        ) || []),
      ],
    });

    setValueTracksChecked([]);
  };

  const customList = (
    title: React.ReactNode,
    items: TrackInfo[] | undefined,
    checked: string[],
    setChecked: Dispatch<SetStateAction<string[]>>,
    isSpotifyPlaylist: boolean = false
  ) => {
    if (!items) {
      return null;
    }

    const trackInfoIds = items?.map((item) => item.id);

    return (
      <Paper variant="outlined" sx={{ border: `1px solid ${borderColor}` }}>
        <CardHeader
          sx={{ px: 2 }}
          action={
            !isSpotifyPlaylist && (
              <IconButton
                disabled={checked.length === 0}
                onClick={handleRemoveFromPlaylist}
              >
                <IconTrash />
              </IconButton>
            )
          }
          avatar={
            <CustomCheckbox
              onClick={handleToggleAll(trackInfoIds, checked, setChecked)}
              checked={
                numberOfChecked(trackInfoIds, checked) === items.length &&
                items.length !== 0
              }
              indeterminate={
                numberOfChecked(trackInfoIds, checked) !== items.length &&
                numberOfChecked(trackInfoIds, checked) !== 0
              }
              disabled={trackInfoIds.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(trackInfoIds, checked)}/${
            items.length
          } selected`}
        />
        <Divider />
        <List
          sx={{
            width: "100%",
            height: 230,
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((item) => {
            const labelId = `transfer-list-all-item-${item.id}-label`;

            return (
              <ListItem
                key={item.id}
                role="listitem"
                button
                onClick={handleToggle(item.id, checked, setChecked)}
              >
                <ListItemButton
                  disabled={isSpotifyPlaylist && compareSelected(item, values)}
                >
                  <ListItemIcon>
                    <CustomCheckbox
                      checked={checked.indexOf(item.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemAvatar>
                    <Avatar src={item.imageUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={item.name}
                    secondary={item.artists}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Paper>
    );
  };

  console.log(values, "values");

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="playlistName">Playlist name</CustomFormLabel>
        <CustomTextField
          id="playlistName"
          variant="outlined"
          value={formik.values.playlistName}
          onChange={formik.handleChange}
          fullWidth
          error={
            formik.touched.playlistName && Boolean(formik.errors.playlistName)
          }
          helperText={formik.touched.playlistName && formik.errors.playlistName}
        />
        {isTemplatePlaylist && (
          <>
            <CustomFormLabel htmlFor="eventType">Event Type</CustomFormLabel>
            <Autocomplete
              disablePortal
              id="eventType"
              options={eventTypes ?? []}
              getOptionLabel={(option) => option.name}
              value={formik.values.eventType}
              onChange={(e, newValue) => {
                formik.setFieldValue("eventType", newValue);
              }}
              fullWidth
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  placeholder="Select event type"
                  aria-label="Select event type"
                  error={
                    formik.touched.eventType &&
                    Boolean(formik.errors.eventType?.name)
                  }
                  helperText={
                    formik.touched.eventType && formik.errors.eventType?.name
                  }
                />
              )}
            />
          </>
        )}
        <Box>
          <CustomFormLabel htmlFor="playlistCreationType">
            Choose the way you want to create your playlist
          </CustomFormLabel>
          <RadioGroup
            row
            aria-label="playlistCreationType"
            name="playlistCreationType"
            value={playlistCreationType}
            onChange={(event: any) => {
              setPlaylistCreationType(event.target.value);
            }}
          >
            <FormControlLabel
              value="spotifySearch"
              control={<CustomRadio color="primary" />}
              label="Search Spotify"
              labelPlacement="end"
            />
            <FormControlLabel
              value="importExistingSpotifyLink"
              control={<CustomRadio color="primary" />}
              label="Import existing Spotify Playlist"
              labelPlacement="end"
            />
            {!isTemplatePlaylist && (
              <FormControlLabel
                value="recommendedPlaylists"
                control={<CustomRadio color="primary" />}
                label="Recommended playlists"
                labelPlacement="end"
              />
            )}
          </RadioGroup>
        </Box>
        {playlistCreationType === "spotifySearch" && (
          <>
            <CustomFormLabel htmlFor="playlistName">
              Search for your song here:
            </CustomFormLabel>
            <Autocomplete
              id="spotify-search"
              freeSolo
              fullWidth
              PaperComponent={(props) => <Paper {...props} elevation={24} />}
              sx={{
                mb: 2,
              }}
              onInputChange={async (_, data) => {
                await getTracks(setTracks, {
                  search: data,
                });
              }}
              onChange={(_, data) => {
                if (data) {
                  setValues({
                    ...values,
                    tracks: [...(values?.tracks || []), data as TrackInfo],
                  });
                }
              }}
              getOptionLabel={(option: string | TrackInfo) =>
                typeof option === "object" ? option.name : ""
              }
              getOptionDisabled={(option) => compareSelected(option, values)}
              options={
                tracks?.map((option, index) => ({
                  ...option,
                  value: index,
                })) || []
              }
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  placeholder="Powered by Spotify"
                  aria-label="PoweredBySpotify"
                />
              )}
              renderOption={(props, option) => {
                return (
                  <ListItem {...props} key={option.id}>
                    <ListItemAvatar>
                      <Avatar src={option.imageUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      id={option.id}
                      primary={option.name}
                      secondary={option.artists}
                    />
                  </ListItem>
                );
              }}
            />
          </>
        )}
        {playlistCreationType === "importExistingSpotifyLink" && (
          <>
            <CustomFormLabel htmlFor="importExistingSpotifyLink">
              Playlist link:
            </CustomFormLabel>
            <CustomTextField
              id="importExistingSpotifyLink"
              variant="outlined"
              placeholder="Insert your Spotify Playlist Link here"
              fullWidth
              sx={{
                mb: 2,
              }}
              onChange={(event: any) => {
                setSpotifyLink(event.target.value);
              }}
              onKeyPress={async (ev: any) => {
                if (ev.key === "Enter") {
                  await getPlaylist(setPlaylist, spotifyLink);
                }
              }}
              value={spotifyLink}
              InputProps={{
                startAdornment: (
                  <IconButton
                    aria-label="search"
                    onClick={async () => {
                      await getPlaylist(setPlaylist, spotifyLink);
                    }}
                  >
                    <IconSearch />
                  </IconButton>
                ),
                endAdornment: (
                  <IconButton
                    aria-label="remove"
                    onClick={() => {
                      setPlaylist(undefined);
                      setSpotifyLink("");
                    }}
                  >
                    <IconXboxX />
                  </IconButton>
                ),
              }}
            />
          </>
        )}
        {playlistCreationType === "recommendedPlaylists" && (
          <Box
            sx={{
              mb: 2,
            }}
          >
            <CustomFormLabel htmlFor="recommendedPlaylists">
              Select a recommended playlist:
            </CustomFormLabel>
            <Tabs
              value={openTab}
              onChange={handleTabChange}
              aria-label="recommended playlists"
              variant="scrollable"
              scrollButtons="auto"
            >
              {templatePlaylists?.map((tab) => (
                <Tab
                  key={tab.id}
                  // icon={tab.icon}
                  label={tab.name}
                  iconPosition="top"
                  value={tab.id}
                />
              ))}
            </Tabs>
          </Box>
        )}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {playlistCreationType !== "spotifySearch" && (
            <>
              <Grid item width={"100%"}>
                {playlist &&
                  customList(
                    playlist.name,
                    playlist.tracks,
                    playlistChecked,
                    setPlaylistChecked,
                    true
                  )}
              </Grid>
              <Grid item width={"100%"}>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleAddToPlaylist}
                    disabled={!playlist || playlist?.tracks.length === 0}
                    aria-label="add to playlist"
                  >
                    Add to playlist
                  </Button>
                </Stack>
              </Grid>
            </>
          )}
          <Grid item width={"100%"}>
            {customList(
              formik.values.playlistName || "Custom Playlist",
              values?.tracks || [],
              valueTracksChecked,
              setValueTracksChecked
            )}
          </Grid>
        </Grid>
        <Box display="flex" flexDirection="row" mt={3}>
          <Button
            variant="outlined"
            disabled={wizardProps?.activeStep === 0}
            onClick={
              wizardProps
                ? wizardProps.handleBack
                : () => setEdit && setEdit(false)
            }
            sx={{ mr: 1 }}
          >
            {wizardProps ? "Back" : "Cancel"}
          </Button>
          <Box flex="1 1 auto" />
          {wizardProps?.isStepOptional(wizardProps?.activeStep) && (
            <Button
              color="inherit"
              onClick={wizardProps?.handleSkip}
              sx={{ mr: 1 }}
            >
              Skip
            </Button>
          )}

          {formik.isSubmitting ? (
            <CircularProgress />
          ) : wizardProps ? (
            <Button variant="contained" type="submit">
              {wizardProps.activeStep === wizardProps.steps.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          ) : (
            <Button variant="contained" type="submit">
              Save
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
    </Box>
  );
};

export default PlaylistEdit;
