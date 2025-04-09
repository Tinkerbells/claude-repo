import type { MenuProps } from '@tinkerbells/xenon-ui'

import { cn } from '@bem-react/classname'
import { memo, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconButton, Menu, Typography } from '@tinkerbells/xenon-ui'

import './navigation-menu.scss'
import { MenuModal } from '../MenuModal'
import { useAppSelector } from '../../../../store/store'
import {
  CloseButton,
  HomeOutlined,
  LogoPlaceholder,
  TableOutlined,
} from '../../../../assets/Icons'
// import { useAppSelector } from "../../../../store/store";

const b = cn('navigation-menu')

type MenuItem = Required<MenuProps>['items'][number]

function NavigationMenuComponent(props: MenuProps) {
  const { ...menuProps } = props
  const [current, setCurrent] = useState('main')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const olapReposrtsPages = useAppSelector(
    state => state.olapReportsPages.pages,
  )

  const memoizedOlapReportsPages = useMemo(
    () => olapReposrtsPages,
    [olapReposrtsPages],
  )

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'logo') {
      setCurrent(e.key)
      // console.log(e);
    }

    if (e.key === 'main') {
      navigate({ to: '/' })
    }
    else {
      const keyId = e.key
      navigate({
        to: '/olapReport/$pageId',
        params: { pageId: keyId },
        // search: (prev) => ({ ...prev })
      })
    }
  }

  // const handleDeleteOlapPage = (pageId) => {
  //   console.log(pageId);

  // }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Мемоизация items, чтобы избежать пересоздания при каждом рендере
  const items = useMemo<MenuItem[]>(() => {
    return [
      {
        icon: <LogoPlaceholder />,
        key: 'logo',
      },
      {
        label: <Link to="/">Главная</Link>,
        icon: <HomeOutlined />,
        key: 'main',
      },
      ...memoizedOlapReportsPages.map(item => ({
        label: (
          <div className="navigation-menu__item">
            <Typography>{item.versionName}</Typography>
            <IconButton
              variant="link"
              size="sm"
              className="navigation-menu__item--close-button"
              onClick={
                showModal
                // () => handleDeleteOlapPage(item.pageId)
              }
            >
              <CloseButton />
            </IconButton>
          </div>
        ),
        icon: <TableOutlined />,
        key: item.pageId,
      })),
    ]
  }, [memoizedOlapReportsPages])

  // console.log(items);

  return (
    <>
      <Menu
        className={b({ mode: menuProps.mode })}
        onClick={onClick}
        mode="horizontal"
        selectedKeys={[current]}
        items={items}
        {...menuProps}
      />
      {isModalOpen && (
        <MenuModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          pageId={current}
          // pageId={page}
        />
      )}
    </>
  )
}

export const NavigationMenu = memo(NavigationMenuComponent)
