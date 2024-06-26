<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCP\AppFramework\Http;

/**
 * Class EmptyFeaturePolicy is a simple helper which allows applications
 * to modify the FeaturePolicy sent by Nextcloud. Per default the policy
 * is forbidding everything.
 *
 * As alternative with sane exemptions look at FeaturePolicy
 *
 * @see \OCP\AppFramework\Http\FeaturePolicy
 * @since 17.0.0
 */
class EmptyFeaturePolicy {
	/** @var string[] of allowed domains to autoplay media */
	protected $autoplayDomains = null;

	/** @var string[] of allowed domains that can access the camera */
	protected $cameraDomains = null;

	/** @var string[] of allowed domains that can use fullscreen */
	protected $fullscreenDomains = null;

	/** @var string[] of allowed domains that can use the geolocation of the device */
	protected $geolocationDomains = null;

	/** @var string[] of allowed domains that can use the microphone */
	protected $microphoneDomains = null;

	/** @var string[] of allowed domains that can use the payment API */
	protected $paymentDomains = null;

	/**
	 * Allows to use autoplay from a specific domain. Use * to allow from all domains.
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedAutoplayDomain(string $domain): self {
		$this->autoplayDomains[] = $domain;
		return $this;
	}

	/**
	 * Allows to use the camera on a specific domain. Use * to allow from all domains
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedCameraDomain(string $domain): self {
		$this->cameraDomains[] = $domain;
		return $this;
	}

	/**
	 * Allows the full screen functionality to be used on a specific domain. Use * to allow from all domains
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedFullScreenDomain(string $domain): self {
		$this->fullscreenDomains[] = $domain;
		return $this;
	}

	/**
	 * Allows to use the geolocation on a specific domain. Use * to allow from all domains
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedGeoLocationDomain(string $domain): self {
		$this->geolocationDomains[] = $domain;
		return $this;
	}

	/**
	 * Allows to use the microphone on a specific domain. Use * to allow from all domains
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedMicrophoneDomain(string $domain): self {
		$this->microphoneDomains[] = $domain;
		return $this;
	}

	/**
	 * Allows to use the payment API on a specific domain. Use * to allow from all domains
	 *
	 * @param string $domain Domain to whitelist. Any passed value needs to be properly sanitized.
	 * @return $this
	 * @since 17.0.0
	 */
	public function addAllowedPaymentDomain(string $domain): self {
		$this->paymentDomains[] = $domain;
		return $this;
	}

	/**
	 * Get the generated Feature-Policy as a string
	 *
	 * @return string
	 * @since 17.0.0
	 */
	public function buildPolicy(): string {
		$policy = '';

		if (empty($this->autoplayDomains)) {
			$policy .= "autoplay 'none';";
		} else {
			$policy .= 'autoplay ' . implode(' ', $this->autoplayDomains);
			$policy .= ';';
		}

		if (empty($this->cameraDomains)) {
			$policy .= "camera 'none';";
		} else {
			$policy .= 'camera ' . implode(' ', $this->cameraDomains);
			$policy .= ';';
		}

		if (empty($this->fullscreenDomains)) {
			$policy .= "fullscreen 'none';";
		} else {
			$policy .= 'fullscreen ' . implode(' ', $this->fullscreenDomains);
			$policy .= ';';
		}

		if (empty($this->geolocationDomains)) {
			$policy .= "geolocation 'none';";
		} else {
			$policy .= 'geolocation ' . implode(' ', $this->geolocationDomains);
			$policy .= ';';
		}

		if (empty($this->microphoneDomains)) {
			$policy .= "microphone 'none';";
		} else {
			$policy .= 'microphone ' . implode(' ', $this->microphoneDomains);
			$policy .= ';';
		}

		if (empty($this->paymentDomains)) {
			$policy .= "payment 'none';";
		} else {
			$policy .= 'payment ' . implode(' ', $this->paymentDomains);
			$policy .= ';';
		}

		return rtrim($policy, ';');
	}
}
