import {createMuiTheme} from '@material-ui/core/styles';
import {
  DEFAULT_FONT_FAMILY,
  BUTTON_FONT_SIZE,
  INPUT_FONT_SIZE,
  CELL_FONT_SIZE,
  DEFAULT_FONT_SIZE,
  TABLE_FONT_SIZE,
  SELECTION_FONT_SIZE
} from 'app/indra/utils/const';

export default createMuiTheme({
  typography: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
  },

  overrides: {
    MuiTypography: {
      root: {
        fontSize: TABLE_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY
      }
    },

    MuiButton: {
      root: {
        margin: '5px',
        padding: '1px 11px',
        paddingLeft: '25px',
        paddingRight: '25px',
        fontWeight: 'bold',
        backgroundColor: '#8ED1FC',
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: BUTTON_FONT_SIZE,
        maxWidth: 250,
        boxSizing: 'border-box',
        '&:hover': {
          backgroundColor: '#4CB6F9'
        }
      }
    },

    MuiInput: {
      root: {
        width: '122px',
        margin: 0,
        border: '1px solid #e2e0de',
        height: 17,
        boxSizing: 'border-box',
        backgroundColor: '#FFF',
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: INPUT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        '&$disabled': {
          backgroundColor: '#D3D3D3'
        }
      },
      colorSecondary: {
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: CELL_FONT_SIZE,
        padding: 0,
        '&$disabled': {
          backgroundColor: '#B5B5B5'
        },
        '& input': {
          padding: '0 2px'
        }
      },
      input: {
        fontSize: INPUT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
      }
    },

    MuiInputBase: {
      input: {
        fontSize: INPUT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
      }
    },

    MuiTextField: {
      root: {}
    },

    MuiSelect: {
      root: {
        height: 17,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: SELECTION_FONT_SIZE
      },
      select: {
        padding: 0,
        height: 17,
        lineHeight: '17px',
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: SELECTION_FONT_SIZE
      },
      icon: {
        top: '-2px'
      }
    },

    MuiMenu: {
      list: {
        margin: 0,
        padding: 0,
        width: '100%'
      }
    },

    MuiMenuItem: {
      root: {
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: SELECTION_FONT_SIZE,
        height: 20,
        padding: '0 6px',
        width: '100%'
      }
    },

    MuiRadio: {
      root: {
        marginLeft: 10,
        marginRight: 5,
        padding: '3px 6px 3px 0',
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    },

    MuiFormControlLabel: {
      label:{
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
      }
    },

    MuiIcon: {}
  }
});
