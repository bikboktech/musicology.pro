import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Alert,
  Grid,
  Autocomplete,
  ListItemButton,
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
  InputAdornment,
  Tabs,
  Tab,
  Link,
  Tooltip,
} from "@mui/material";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomRadio from "../../src/components/forms/theme-elements/CustomRadio";
import { IconPhoto, IconSearch } from "@tabler/icons-react";
import { IconXboxX } from "@tabler/icons-react";

const PlaylistEdit = () => {
  return (
    <Box>
      <CustomFormLabel htmlFor="playlistName">Playlist name</CustomFormLabel>
      <CustomTextField
        id="playlistName"
        variant="outlined"
        value={playlistName}
        onChange={(event: any) => {
          setPlaylistName(event.target.value);
        }}
        fullWidth
      />
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
          <FormControlLabel
            value="recommendedPlaylists"
            control={<CustomRadio color="primary" />}
            label="Recommended playlists"
            labelPlacement="end"
          />
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
            sx={{
              mb: 2,
            }}
            onChange={(_, data) => {
              if (data) {
                setPlaylistTracks([...playlistTracks, data]);
              }
            }}
            getOptionLabel={(
              option: string | { value: number; title: string; year: number }
            ) => (typeof option === "object" ? option.title : "")}
            options={top100Films.map((option, index) => ({
              ...option,
              value: index,
            }))}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                placeholder="Powered by Spotify"
                aria-label="PoweredBySpotify"
              />
            )}
            renderOption={(props, option) => (
              <ListItem
                {...props}
                // onClick={handleToggle(value)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <IconPhoto width={20} height={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={option.value.toString()}
                  primary={option.title}
                  secondary={option.year}
                />
              </ListItem>
            )}
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
            onKeyPress={(ev) => {
              // if (ev.key === "Enter") {
              //   debouncedSearch(refetch, variables, searchValue);
              // }
            }}
            // value={searchValue}
            InputProps={{
              startAdornment: (
                <IconButton
                  aria-label="search"
                  onClick={
                    () => {}
                    // removeQuoteIdFilter(refetch, variables)
                  }
                >
                  <IconSearch />
                </IconButton>
              ),
              endAdornment: (
                <IconButton
                  aria-label="remove"
                  onClick={
                    () => {}
                    // removeQuoteIdFilter(refetch, variables)
                  }
                >
                  <IconXboxX />
                </IconButton>
              ),
            }}
            // onChange={(event) =>
            //   handleSearchInput(refetch, variables, event)
            // }
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
            aria-label="clients"
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                // icon={tab.icon}
                label={tab.label}
                iconPosition="top"
                value={tab.value}
              />
            ))}
          </Tabs>
        </Box>
      )}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {playlistCreationType !== "spotifySearch" && (
          <>
            <Grid item width={"100%"}>
              {customList(
                "Other Playlist",
                top100Films.map((el, index) => ({
                  ...el,
                  value: index,
                }))
              )}
            </Grid>
            <Grid item width={"100%"}>
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleCheckedUp}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  <IconChevronDown width={20} height={20} />
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleCheckedDown}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  <IconChevronUp width={20} height={20} />
                </Button>
              </Stack>
            </Grid>
          </>
        )}
        <Grid item width={"100%"}>
          {customList(playlistName || "Custom Playlist", playlistTracks)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaylistEdit;
