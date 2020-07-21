import React from 'react';
import { useOvermind } from 'app/overmind';
import { Menu, Stack, Icon, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardBaseFolder } from '../../../types';

type FolderMenuProps = {
  folder: DashboardBaseFolder;
  setRenaming: (renaming: boolean) => void;
};

export const FolderMenu = ({ folder, setRenaming }: FolderMenuProps) => {
  const {
    actions,
    state: { activeTeamInfo },
  } = useOvermind();
  const { visible, setVisibility, position } = React.useContext(Context);

  const isDrafts = folder.path === '/drafts';

  // default to ADMIN if we don't know (personal space + not set)
  const authorization = activeTeamInfo?.userAuthorization || 'ADMIN';

  if (isDrafts || authorization === 'READ')
    return (
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
        style={{ width: 120 }}
      >
        <MenuItem onSelect={() => {}}>
          <Stack gap={1}>
            <Icon name="lock" size={14} />
            <Text>Protected</Text>
          </Stack>
        </MenuItem>
      </Menu.ContextMenu>
    );

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => setRenaming(true)}>Rename folder</MenuItem>
      <MenuItem
        onSelect={() => {
          actions.dashboard.deleteFolder({ path: folder.path });
          setVisibility(false);
          track('Dashboard - Delete folder', {
            source: 'Grid',
            dashboardVersion: 2,
          });
        }}
      >
        Delete folder
      </MenuItem>
    </Menu.ContextMenu>
  );
};
