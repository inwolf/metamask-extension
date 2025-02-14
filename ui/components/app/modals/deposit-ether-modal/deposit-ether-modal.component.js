import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  NETWORK_TO_NAME_MAP,
  BUYABLE_CHAINS_MAP,
} from '../../../../../shared/constants/network';
import Button from '../../../ui/button';
import LogoMoonPay from '../../../ui/logo/logo-moonpay';

export default class DepositEtherModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func.isRequired,
  };

  static propTypes = {
    chainId: PropTypes.string.isRequired,
    isTestnet: PropTypes.bool.isRequired,
    isMainnet: PropTypes.bool.isRequired,
    isBuyableTransakChain: PropTypes.bool.isRequired,
    isBuyableMoonPayChain: PropTypes.bool.isRequired,
    toWyre: PropTypes.func.isRequired,
    toTransak: PropTypes.func.isRequired,
    toMoonPay: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    toFaucet: PropTypes.func.isRequired,
    hideWarning: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    showAccountDetailModal: PropTypes.func.isRequired,
  };

  goToAccountDetailsModal = () => {
    this.props.hideWarning();
    this.props.hideModal();
    this.props.showAccountDetailModal();
  };

  renderRow({
    logo,
    title,
    text,
    buttonLabel,
    onButtonClick,
    hide,
    className,
    hideButton,
    hideTitle,
    onBackClick,
    showBackButton,
  }) {
    if (hide) {
      return null;
    }

    return (
      <div className={className || 'deposit-ether-modal__buy-row'}>
        {onBackClick && showBackButton && (
          <div
            className="deposit-ether-modal__buy-row__back"
            onClick={onBackClick}
          >
            <i className="fa fa-arrow-left cursor-pointer" />
          </div>
        )}
        <div className="deposit-ether-modal__buy-row__logo-container">
          {logo}
        </div>
        <div className="deposit-ether-modal__buy-row__description">
          {!hideTitle && (
            <div className="deposit-ether-modal__buy-row__description__title">
              {title}
            </div>
          )}
          <div className="deposit-ether-modal__buy-row__description__text">
            {text}
          </div>
        </div>
        {!hideButton && (
          <div className="deposit-ether-modal__buy-row__button">
            <Button
              type="secondary"
              className="deposit-ether-modal__deposit-button"
              large
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      chainId,
      toWyre,
      toTransak,
      toMoonPay,
      address,
      toFaucet,
      isTestnet,
      isMainnet,
      isBuyableTransakChain,
      isBuyableMoonPayChain,
    } = this.props;
    const { t } = this.context;
    const networkName = NETWORK_TO_NAME_MAP[chainId];
    const symbol = BUYABLE_CHAINS_MAP[chainId].nativeCurrency;

    return (
      <div className="page-container page-container--full-width page-container--full-height">
        <div className="page-container__header">
          <div className="page-container__title">
            {t('depositCrypto', [symbol])}
          </div>
          <div className="page-container__subtitle">
            {t('needCryptoInWallet', [symbol])}
          </div>
          <div
            className="page-container__header-close"
            onClick={() => {
              this.props.hideWarning();
              this.props.hideModal();
            }}
          />
        </div>
        <div className="page-container__content">
          <div className="deposit-ether-modal__buy-rows">
            {this.renderRow({
              logo: (
                <div
                  className="deposit-ether-modal__logo"
                  style={{
                    backgroundImage: "url('./images/transak.svg')",
                    height: '60px',
                  }}
                />
              ),
              title: t('buyCryptoWithTransak', [symbol]),
              text: t('buyCryptoWithTransakDescription', [symbol]),
              buttonLabel: t('continueToTransak'),
              onButtonClick: () => {
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Accounts',
                    action: 'Deposit Ether',
                    name: 'Click buy Ether via Transak',
                  },
                });
                toTransak(address, chainId);
              },
              hide: !isBuyableTransakChain,
            })}
            {this.renderRow({
              logo: (
                <LogoMoonPay className="deposit-ether-modal__logo--moonpay" />
              ),
              title: t('buyCryptoWithMoonPay', [symbol]),
              text: t('buyCryptoWithMoonPayDescription', [symbol]),
              buttonLabel: t('continueToMoonPay'),
              onButtonClick: () => {
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Accounts',
                    action: 'Deposit tokens',
                    name: 'Click buy tokens via MoonPay',
                  },
                });
                toMoonPay(address, chainId);
              },
              hide: !isBuyableMoonPayChain,
            })}
            {this.renderRow({
              logo: (
                <div
                  className="deposit-ether-modal__logo"
                  style={{
                    backgroundImage: "url('./images/wyre.svg')",
                    height: '40px',
                  }}
                />
              ),
              title: t('buyWithWyre'),
              text: t('buyWithWyreDescription'),
              buttonLabel: t('continueToWyre'),
              onButtonClick: () => {
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Accounts',
                    action: 'Deposit Ether',
                    name: 'Click buy Ether via Wyre',
                  },
                });
                toWyre(address);
              },
              hide: !isMainnet,
            })}
            {this.renderRow({
              logo: (
                <img
                  alt=""
                  className="deposit-ether-modal__logo"
                  src="./images/deposit-eth.svg"
                  style={{
                    height: '75px',
                    width: '75px',
                  }}
                />
              ),
              title: t('directDepositCrypto', [symbol]),
              text: t('directDepositCryptoExplainer', [symbol]),
              buttonLabel: t('viewAccount'),
              onButtonClick: () => this.goToAccountDetailsModal(),
            })}
            {networkName &&
              this.renderRow({
                logo: <i className="fa fa-tint fa-2x" />,
                title: t('testFaucet'),
                text: t('getEtherFromFaucet', [networkName]),
                buttonLabel: t('getEther'),
                onButtonClick: () => toFaucet(chainId),
                hide: !isTestnet,
              })}
          </div>
        </div>
      </div>
    );
  }
}
