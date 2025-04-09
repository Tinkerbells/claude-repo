import type { FC } from 'react'

// export type SvgSelectorIconType = "modal-cross";

interface Props {
  id: string
  svgColor?: string
  classSVG?: string
  height?: number | string
  width?: number | string
}

export const SvgSelector: FC<Props> = ({
  id,
  svgColor,
  height,
  width,
  // classSVG = "#6F767E",
}) => {
  switch (id) {
    case 'modal-cross':
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_12_2110)">
            <path
              d="M9.46558 8.00009L15.6958 1.76978C15.8902 1.57532 15.9993 1.31164 15.9993 1.03671C15.9992 0.761786 15.8899 0.498139 15.6954 0.303787C15.501 0.109435 15.2373 0.000294982 14.9624 0.000366246C14.6875 0.00043751 14.4238 0.109716 14.2295 0.304169L8 6.53452L1.77063 0.304169C1.57628 0.109716 1.31252 0.00043751 1.0376 0.000366246C0.762671 0.000294982 0.499018 0.109435 0.304565 0.303787C0.110113 0.498139 0.000803721 0.761786 0.000732457 1.03671C0.000661193 1.31164 0.109847 1.57532 0.304199 1.76978L6.53442 8.00009L0.304199 14.2304C0.207966 14.3267 0.131652 14.441 0.0795899 14.5668C0.0275279 14.6926 0.00069717 14.8274 0.000732457 14.9635C0.000803721 15.2384 0.110113 15.5021 0.304565 15.6964C0.499018 15.8908 0.762671 15.9999 1.0376 15.9999C1.31252 15.9998 1.57628 15.8905 1.77063 15.696L8 9.46568L14.2294 15.696C14.4237 15.8905 14.6874 15.9998 14.9623 15.9999C15.2372 15.9999 15.501 15.8908 15.6954 15.6964C15.8899 15.5021 15.9992 15.2384 15.9993 14.9635C15.9993 14.6886 15.8902 14.4249 15.6958 14.2304L9.46558 8.00009Z"
              fill={svgColor || '#0079BE'}
            />
          </g>
          <defs>
            <clipPath id="clip0_12_2110">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    case 'left-arrow':
      return (
        <svg
          style={{
            cursor: 'pointer',
          }}
          width={width ?? '20'}
          height={height ?? '20'}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3314 15.7922L13.7781 15.3664C13.8465 15.3017 13.9009 15.2237 13.9381 15.1372C13.9753 15.0507 13.9945 14.9576 13.9945 14.8635C13.9945 14.7693 13.9753 14.6762 13.9381 14.5897C13.9009 14.5033 13.8465 14.4253 13.7781 14.3605L8.71692 9.50293L13.7837 4.63971C13.852 4.57497 13.9065 4.49698 13.9436 4.41052C13.9808 4.32406 14 4.23096 14 4.13684C14 4.04272 13.9808 3.94956 13.9436 3.8631C13.9065 3.77664 13.852 3.69865 13.7837 3.63391L13.3397 3.20801C13.198 3.07441 13.0106 3 12.8159 3C12.6211 3 12.4337 3.07441 12.292 3.20801L6.23761 8.99823C6.16622 9.06206 6.10842 9.13957 6.0676 9.2262C6.02677 9.31282 6.00379 9.40681 6 9.5025L6 9.5047C6.00399 9.60012 6.02705 9.69375 6.06787 9.78009C6.10869 9.86643 6.1664 9.94374 6.23761 10.0074L12.2756 15.7922C12.4187 15.9269 12.6082 16.0013 12.8048 16C13.0006 16.0014 13.1893 15.927 13.3314 15.7922Z"
            fill="white"
          />
        </svg>
      )

    default:
      return null
  }
}
