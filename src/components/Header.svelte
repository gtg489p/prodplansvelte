<script>
    import { Chevron, Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte'
  </script>
  
  <Navbar let:hidden let:toggle color="blue">
    <NavBrand href="/">
      <img src="/factory_toss_nobg_icon.png" class="mr-3 h-14 sm:h-14" alt="ProdPlan Logo"/>
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ProdPlan</span>
    </NavBrand>
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" src="/ryan.png" />
      <NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1"/>
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
      <span class="block text-sm"> Ryan Stelt </span>
      <span class="block truncate text-sm font-medium"> ryan@jvl.com </span>
      </DropdownHeader>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownDivider />
      <DropdownItem>Sign out</DropdownItem>
    </Dropdown>
    <NavUl {hidden}>
      <NavLi href="/" active={true}>Home</NavLi>
      <NavLi href="/about">About</NavLi>
      <NavLi href="/services">Services</NavLi>
      <NavLi href="/pricing">Pricing</NavLi>
      <NavLi href="/contact">Contact</NavLi>
      <NavLi id="nav-menu1" class="cursor-pointer"><Chevron aligned>Dropdown</Chevron></NavLi>
      <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Earnings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
    </NavUl>
  </Navbar>